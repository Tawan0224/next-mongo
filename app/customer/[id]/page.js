import Link from "next/link";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";

export default async function CustomerDetailPage({ params }) {
  // Directly query the database in Server Component
  await dbConnect();
  const customer = await Customer.findById(params.id).lean();
  
  // Convert MongoDB document to plain object
  const customerData = {
    ...customer,
    _id: customer._id.toString(),
    dateOfBirth: customer.dateOfBirth.toISOString(),
    createdAt: customer.createdAt.toISOString()
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">


        {/* Customer Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
            Customer Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Member Number */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase">
                Member Number
              </label>
              <p className="text-lg text-gray-900 mt-1 font-mono bg-gray-100 px-3 py-2 rounded">
                {customerData.memberNumber}
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase">
                Full Name
              </label>
              <p className="text-lg text-gray-900 mt-1 font-semibold">
                {customerData.name}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase">
                Email Address
              </label>
              <p className="text-lg text-blue-600 mt-1">
                <a href={`mailto:${customerData.email}`} className="hover:underline">
                  {customerData.email}
                </a>
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase">
                Phone Number
              </label>
              <p className="text-lg text-gray-900 mt-1">
                <a href={`tel:${customerData.phone}`} className="hover:text-blue-600">
                  {customerData.phone}
                </a>
              </p>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase">
                Date of Birth
              </label>
              <p className="text-lg text-gray-900 mt-1">
                {new Date(customerData.dateOfBirth).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Member Since */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase">
                Member Since
              </label>
              <p className="text-lg text-gray-900 mt-1">
                {new Date(customerData.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Address - Full Width */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-600 uppercase">
                Address
              </label>
              <p className="text-lg text-gray-900 mt-1 bg-gray-50 p-3 rounded border border-gray-200">
                {customerData.address}
              </p>
            </div>

            {/* Interests - Full Width */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-600 uppercase">
                Interests
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {customerData.interests && customerData.interests.length > 0 ? (
                  customerData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No interests listed</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t flex gap-4">
            <Link
              href="/customer"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}