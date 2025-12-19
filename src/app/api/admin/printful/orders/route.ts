import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin";
import {
  createOrder,
  confirmOrder,
  getOrder,
  getOrders,
  cancelOrder,
  getShippingRates,
  getOrderEstimate,
  testConnection,
} from "@/lib/printful";

// GET - List orders or get specific order
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20");

    // Test connection
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return NextResponse.json(
        { error: connectionTest.message },
        { status: 400 }
      );
    }

    // Get specific order
    if (orderId) {
      try {
        const order = await getOrder(parseInt(orderId));
        return NextResponse.json({ order });
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Order not found" },
          { status: 404 }
        );
      }
    }

    // List orders
    const orders = await getOrders(status, limit);
    return NextResponse.json({
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST - Create order, get shipping rates, or get estimate
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    // Test connection
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return NextResponse.json(
        { error: connectionTest.message },
        { status: 400 }
      );
    }

    switch (action) {
      case "shipping_rates": {
        const { recipient, items } = body;
        if (!recipient || !items) {
          return NextResponse.json(
            { error: "recipient and items are required" },
            { status: 400 }
          );
        }

        const rates = await getShippingRates({ recipient, items });
        return NextResponse.json({ rates });
      }

      case "estimate": {
        const { recipient, items } = body;
        if (!recipient || !items) {
          return NextResponse.json(
            { error: "recipient and items are required" },
            { status: 400 }
          );
        }

        const estimate = await getOrderEstimate({
          recipient,
          items: items.map((item: { variant_id: number; quantity: number; imageUrl: string; placement?: string }) => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
            files: [{
              type: item.placement || "front",
              url: item.imageUrl,
            }],
          })),
        });
        return NextResponse.json({ estimate });
      }

      case "create": {
        const { recipient, items, external_id, confirm = false } = body;
        if (!recipient || !items) {
          return NextResponse.json(
            { error: "recipient and items are required" },
            { status: 400 }
          );
        }

        // Validate recipient
        const requiredFields = ["name", "address1", "city", "country_code", "zip"];
        for (const field of requiredFields) {
          if (!recipient[field]) {
            return NextResponse.json(
              { error: `recipient.${field} is required` },
              { status: 400 }
            );
          }
        }

        // Build order items
        const orderItems = items.map((item: {
          variant_id: number;
          quantity: number;
          imageUrl: string;
          placement?: string;
        }) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
          files: [{
            type: item.placement || "default",
            url: item.imageUrl,
          }],
        }));

        const order = await createOrder(
          {
            external_id,
            recipient,
            items: orderItems,
          },
          confirm
        );

        return NextResponse.json({
          success: true,
          order,
          message: confirm ? "Order created and confirmed" : "Draft order created",
        });
      }

      case "confirm": {
        const { orderId } = body;
        if (!orderId) {
          return NextResponse.json(
            { error: "orderId is required" },
            { status: 400 }
          );
        }

        const order = await confirmOrder(orderId);
        return NextResponse.json({
          success: true,
          order,
          message: "Order confirmed",
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action. Use: shipping_rates, estimate, create, or confirm" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Order action error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process order" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel order
export async function DELETE(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    // Test connection
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return NextResponse.json(
        { error: connectionTest.message },
        { status: 400 }
      );
    }

    const order = await cancelOrder(parseInt(orderId));
    return NextResponse.json({
      success: true,
      order,
      message: "Order cancelled",
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to cancel order" },
      { status: 500 }
    );
  }
}
