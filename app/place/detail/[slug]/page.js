import PlaceItemDetail from "@/app/components/PlaceItemDetail";

export default function PlaceDeatilPage({params}) {
  let today = new Date();   
  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1;  // 월
  let date = today.getDate();  // 날짜

  return (
    <div>
      <PlaceItemDetail 
        placeId={params.slug}
        today={year + '-' + month + '-' + date}
      />
    </div>
  )
}
