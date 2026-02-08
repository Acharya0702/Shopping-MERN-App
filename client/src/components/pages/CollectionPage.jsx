import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../products/FilterSidebar";
import SortOptions from "../products/SortOptions";
import ProductGrid from "../products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../../redux/slices/productsSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [ searchParams ] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state)=>state.products);
  const queryParams = Object.fromEntries([...searchParams]);
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(()=>{
    dispatch(fetchProductsByFilters({ collection, ...queryParams}));
  },[dispatch, collection, searchParams])
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleClickoutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickoutside);
    return ()=>{
      document.removeEventListener("mousedown", handleClickoutside);
    };
  },[]);

  return (
    <div className="flex flex-col lg:flex-row px-16">
      {/* Mobile filter button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" />
      </button>
      {/* Filter sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-0"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0"
        `}
      >
        <FilterSidebar />
      </div>
      <div className="flex-grow p-4">
        <h2 className="uppercase text-2xl mb-4 text-center">{queryParams.gender || queryParams.category} Collection</h2>
        {/* Sort options */}
        <SortOptions />
        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
