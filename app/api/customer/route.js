import dbConnect from '@/lib/db';
import Customer from '@/models/Customer';

export async function GET() {
  await dbConnect();
  const customers = await Customer.find({}).sort({ createdAt: -1 });
  return Response.json(customers);
}

export async function POST(request) {
  await dbConnect();
  const data = await request.json();
  const customer = await Customer.create(data);
  return Response.json(customer);
}

export async function PUT(request) {
  await dbConnect();
  const data = await request.json();
  const customer = await Customer.findByIdAndUpdate(data._id, data, { new: true });
  return Response.json(customer);
}