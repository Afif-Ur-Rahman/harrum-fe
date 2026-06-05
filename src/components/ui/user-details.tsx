import Image from "next/image";
import { SuperAdminRestaurant } from "@/types/super-admin";

interface UserDetailsProps {
  restaurant: SuperAdminRestaurant;
}

export const UserDetails = ({ restaurant }: UserDetailsProps) => (
  <div className="p-4">
    <div className="flex items-center gap-4 mb-4">
      <Image
        src={restaurant.image}
        alt={restaurant.fullName}
        width={80}
        height={80}
        className="rounded-full object-cover w-16 h-16"
      />
      <div>
        <div className="text-lg font-bold">{restaurant.fullName}</div>
        <div className="text-gray-500">{restaurant.email}</div>
        <div className="text-sm text-gray-400">{restaurant.username}</div>
      </div>
    </div>
    <div className="space-y-2">
      <div><strong>Address:</strong> {restaurant.address}</div>
      <div><strong>City:</strong> {restaurant.city}</div>
      <div><strong>Country:</strong> {restaurant.country}</div>
      <div>
        <strong>Verified:</strong> {restaurant.isVerified ? "Yes" : "No"}
      </div>
      <div>
        <strong>Created At:</strong> {new Date(restaurant.createdAt).toLocaleString()}
      </div>
    </div>
  </div>
);
