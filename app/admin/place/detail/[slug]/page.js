import AdminPlaceDetail from "@/app/components/AdminPlaceDetail";


export default  function AdminPlaceDetailPage({params}) {
    return (
      <div>
        <AdminPlaceDetail placeId={params.slug} />
      </div>
    )
  }
  
  