"use client";

import {
  Package,
  PackageCheck,
  Truck,
  Bike,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    title: "Pending",
    icon: Package,
  },
  {
    title: "Processing",
    icon: PackageCheck,
  },
  {
    title: "Shipped",
    icon: Truck,
  },
  {
    title: "Out for Delivery",
    icon: Bike,
  },
  {
    title: "Delivered",
    icon: CheckCircle,
  },
];

export default function TrackingTimeline({
  status,
  order,
}: {
  status: string;
  order: any;
}) {
  
  const currentStep = steps.findIndex(
    (step) => step.title === status
  );
const courier = order?.courier || "TCS Express";
const trackingNumber = order?.trackingNumber || order?.id;
const estimatedDelivery =
  typeof order?.estimatedDelivery === "function"
    ? order.estimatedDelivery()
    : order?.estimatedDelivery;
  return (
    <div>
  <div className="mb-6">
    <div className="flex justify-between text-sm mb-2">
      <span className="font-medium">Order Progress</span>
      <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
    </div>

    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="bg-pink-600 h-3 rounded-full transition-all duration-500"
        style={{
          width: `${((currentStep + 1) / steps.length) * 100}%`,
        }}
      />
    </div>
  </div>

  <div className="space-y-6">
      {steps.map((step, index) => {
        const Icon = step.icon;

        const completed = index < currentStep;
        const active = index === currentStep;

        return (
          <div key={step.title} className="flex gap-4 relative">
            {index !== steps.length - 1 && (
              <div
                className={`absolute left-5 top-10 w-1 h-12 rounded-full
                ${
                  completed
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
              />
            )}

            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center
              ${
                completed
                  ? "bg-green-500 text-white"
                  : active
                  ? "bg-pink-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <Icon size={18} />
            </div>

            <div>
              <h3
                className={`font-semibold
                ${
                  completed
                    ? "text-green-600"
                    : active
                    ? "text-pink-600"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </h3>

              <p className="text-sm text-gray-500">
                {completed
                  ? "Completed"
                  : active
                  ? "Current Status"
                  : "Waiting"}
              </p>
            </div>
          </div>
        );
      })}
      </div>
      <div className="mt-8 border rounded-xl p-4 bg-pink-50">
  <h3 className="font-bold text-lg mb-3">Shipping Details</h3>

  <div className="flex justify-between mb-2">
    <span>Courier</span>
    <span className="font-semibold">{courier}</span>
  </div>

  <div className="flex justify-between mb-2">
    <span>Tracking Number</span>
    <span className="font-semibold">{trackingNumber}</span>
  </div>

  <div className="flex justify-between">
    <span>Estimated Delivery</span>
    <span className="font-semibold text-pink-600">
      {estimatedDelivery}
    </span>
  </div>
</div>
</div>
);
}