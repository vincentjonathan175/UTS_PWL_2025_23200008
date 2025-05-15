import prisma from "@/lib/prisma";

export async function PUT(request, {params}) {
    const { id } = params;
    const { order_date, order_by, selected_package, qty, status } = await request.json();

    if (!order_date || !order_by || !selected_package || !qty || !status ) {
       return new Response(JSON.stringify({ error: 'Field kosong'}), {status: 400});
    }

    const OrderDate = new Date(order_date).toISOString();

    const is_paid = status === "Lunas";

    const preorder = await prisma.preorder.update({
        where: { id: Number(id) },
        data: { order_date: OrderDate, order_by, selected_package, qty, is_paid },
    });

    const Preorder = {
        id: preorder.id,
        order_date: preorder.order_date.toISOString().split('T')[0],
        order_by: preorder.order_by,
        selected_package: preorder.selected_package,
        qty: preorder.qty,
        status: preorder.is_paid ? "Lunas" : "Belum Lunas"
    };

    return new Response(JSON.stringify(Preorder), { status: 200 }); 
}

export async function DELETE(request, {params}) {
    const { id } = params;
    
    if (!id) return new Response(JSON.stringify({ error: "ID tidak ditemukan" }), 
        { status: 400 });

    const deletedPreorder = await prisma.preorder.delete({
        where: { id: Number(id) },
    });
        
    return new Response(JSON.stringify({ message: "Berhasil dihapus"}), 
        { status: 200 });
}