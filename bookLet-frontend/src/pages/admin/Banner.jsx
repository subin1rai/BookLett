import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { PlusCircle } from "lucide-react";
import BannerAddModal from "../../components/admin/banner/AddBanner";
import BannerTable from "../../components/admin/banner/BannerTable";
import apiClient from "../../api/axios";
import PreviewBanner from "../../components/admin/banner/PreviewBanner";
import DeleteBanner from "../../components/admin/banner/DeleteBanner";

const colorOptions = [
  {
    name: "Blue",
    value: "blue",
    bg: "bg-blue-100",
    text: "text-blue-800",
    preview: "bg-blue-500",
  },
  {
    name: "Green",
    value: "green",
    bg: "bg-green-100",
    text: "text-green-800",
    preview: "bg-green-500",
  },
  {
    name: "Red",
    value: "red",
    bg: "bg-red-100",
    text: "text-red-800",
    preview: "bg-red-500",
  },
  {
    name: "Yellow",
    value: "yellow",
    bg: "bg-[#DCF763]",
    text: "text-[#DCF763]",
    preview: "bg-[#DCF763]",
  },
  {
    name: "Purple",
    value: "purple",
    bg: "bg-[#435058]",
    text: "text-[#435058]",
    preview: "bg-[#435058]",
  },
];

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(null);

  const token = localStorage.getItem("token");

  const fetchAnnouncements = async () => {
    try {
      const res = await apiClient.get("/announcement/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const mapped = (res.data?.data || []).map((a) => ({
        id: a.announcementId,
        message: a.message,
        startDate: a.startTime?.split("T")[0],
        endDate: a.endTime?.split("T")[0],
        IsPinned: a.isPinned,
        color: a.color || "blue",
        textColor: a.textColor || "white",
      }));
      setBanners(mapped);
    } catch {
      setBanners([]);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const getColorClass = (color, type) => {
    const colorOption = colorOptions.find((option) => option.value === color);
    return colorOption
      ? colorOption[type]
      : type === "bg"
      ? "bg-gray-100"
      : "text-gray-800";
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatus = (banner) => {
    const today = new Date();
    const start = new Date(banner.startDate);
    const end = new Date(banner.endDate);
    if (!banner.IsPinned)
      return { label: "Inactive", class: "bg-gray-100 text-gray-600" };
    if (today < start)
      return { label: "Scheduled", class: "bg-yellow-100 text-yellow-800" };
    if (today > end)
      return { label: "Expired", class: "bg-red-100 text-red-800" };
    return { label: "Active", class: "bg-green-100 text-green-800" };
  };

  const handleAdd = () => {
    setCurrentBanner({
      id: null,
      message: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      IsPinned: true,
      color: "blue",
      textColor: "white",
    });
    setIsAddOpen(true);
  };

  const handleEdit = (banner) => {
    setCurrentBanner({ ...banner });
    setIsEditOpen(true);
  };

  const handleDelete = (banner) => {
    setCurrentBanner(banner);
    setIsDeleteOpen(true);
  };

  const handlePreview = (banner) => {
    setPreviewBanner(banner);
  };

  const saveBanner = async () => {
    const method = isAddOpen ? apiClient.post : apiClient.put;
    const url = isAddOpen
      ? "/announcement/addAnnouncement"
      : `/announcement/update/${currentBanner.id}`;
    try {
      await method(
        url,
        {
          Message: currentBanner.message,
          StartTime: new Date(currentBanner.startDate).toISOString(),
          EndTime: new Date(currentBanner.endDate).toISOString(),
          IsPinned: currentBanner.IsPinned,
          Color: currentBanner.color,
          TextColor: currentBanner.textColor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAnnouncements();
      setIsAddOpen(false);
      setIsEditOpen(false);
      setCurrentBanner(null);
      toast.success(
        isAddOpen ? "Banner added successfully" : "Banner updated successfully"
      );
    } catch {
      console.log("Failed to save banner. Please try again.");
    }
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/announcement/delete/${currentBanner.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAnnouncements();
      setIsDeleteOpen(false);
      setCurrentBanner(null);
      toast.success("Banner deleted successfully");
    } catch {
      console.log("Failed to delete banner. Please try again.");
    }
  };

  const toggleIsPinned = async (id) => {
    const banner = banners.find((b) => b.id === id);
    if (!banner) return;
    try {
      await apiClient.put(
        `/announcement/update/${id}`,
        {
          Message: banner.message,
          StartTime: new Date(banner.startDate).toISOString(),
          EndTime: new Date(banner.endDate).toISOString(),
          IdPinned: !banner.IsPinned,
          Color: banner.color.bg,
          TextColor: banner.textColor.text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAnnouncements();
      toast.success(
        `Banner ${!banner.IsPinned ? "activated" : "deactivated"} successfully`
      );
    } catch {
      console.log("Failed to update banner status.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Banner Management</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white flex items-center px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <PlusCircle size={18} className="mr-2" />
          Add Banner
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <BannerTable
          banners={banners}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onToggle={toggleIsPinned}
          getColorClass={getColorClass}
          getStatus={getStatus}
          formatDate={formatDate}
        />
      </div>

      <BannerAddModal
        isOpen={isAddOpen || isEditOpen}
        isEdit={isEditOpen}
        banner={currentBanner}
        setBanner={setCurrentBanner}
        onClose={() => {
          setIsAddOpen(false);
          setIsEditOpen(false);
          setCurrentBanner(null);
        }}
        onSave={saveBanner}
        colorOptions={colorOptions}
      />

      <DeleteBanner
        banner={isDeleteOpen ? currentBanner : null}
        onCancel={() => {
          setIsDeleteOpen(false);
          setCurrentBanner(null);
        }}
        onConfirm={confirmDelete}
      />

      <PreviewBanner
        banner={previewBanner}
        onClose={() => setPreviewBanner(null)}
        getColorClass={getColorClass}
        formatDate={formatDate}
        getStatus={getStatus}
      />
    </div>
  );
};

export default Banner;
