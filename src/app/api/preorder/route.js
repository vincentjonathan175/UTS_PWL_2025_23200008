import prisma from '@/lib/prisma';

export async function GET() {
    const data = await prisma.preorder.findMany({
        orderBy: { id: 'asc' },
    });

    const Data = data.map((item) => ({
        id: item.id,
        order_date: item.order_date.toISOString().split('T')[0],
        order_by: item.order_by,
        selected_package: item.selected_package,
        qty: item.qty,
        status: item.is_paid ? "Lunas" : "Belum Lunas",
    }));

    return new Response(JSON.stringify(Data), { status: 200 });
}

export async function POST(request) {
    const { order_date, order_by, selected_package, qty, status } = await request.json();
    
    if (!order_date || !order_by || !selected_package || !qty || !status) {
        return new Response(JSON.stringify({ error: 'Semua field wajib diisi' }), {
         status: 400,
        });
    }

    const OrderDate = new Date(order_date).toISOString();

    const is_paid = status === "Lunas";

    const preorder = await prisma.preorder.create({
        data: { order_date: OrderDate, order_by, selected_package, qty: parseInt(qty), is_paid },
    });
    
    preorder.order_date = preorder.order_date.toISOString().split('T')[0];
    preorder.status = is_paid ? "Lunas" : "Belum Lunas";
    delete preorder.is_paid;

    return new Response(JSON.stringify(preorder), { status: 201 });
}