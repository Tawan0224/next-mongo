import dbConnect from '@/lib/db';
import Customer from '@/models/Customer';

export async function GET(request, { params }) {
  await dbConnect();
  const customer = await Customer.findById(params.id);
  return Response.json(customer);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const customer = await Customer.findByIdAndDelete(params.id);
  return Response.json(customer);
}