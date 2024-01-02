import AdminProductDetail from "@/app/components/AdminProductDetail";

export default function AdminProductDetailPage({params}) {
  return (
    <div>
      <AdminProductDetail productId={params.slug} />
    </div>
  )
}
