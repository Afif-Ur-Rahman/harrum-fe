import Image from "next/image";

const Nodata = ({ height = 10 }: { height?: number }) => {
  return (
    <div className="flex items-center justify-center h-50">
      <div className="flex items-center flex-col">
        <Image
          src="/no-data.gif"
          height="100"
          width="100"
          alt="No data"
          className={`w-auto h-${height} object-cover`}
        />
        <span className={`font-semibold`}>No Data</span>
      </div>
    </div>
  );
};

export default Nodata;
