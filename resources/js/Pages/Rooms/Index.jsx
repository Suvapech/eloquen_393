import React, { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';

export default function Index() {
  const { bookings = [] } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredBookings = bookings.filter(booking =>
    [booking.customer_name, booking.customer_phone, booking.room_number]
      .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const currentBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto p-8 bg-white shadow-xl rounded-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">รายการการจองที่พัก</h2>

        <div className="flex justify-center mb-6 space-x-4">
          <input
            type="text"
            placeholder="🔍 ค้นหาด้วยชื่อลูกค้า หมายเลขโทรศัพท์ หรือหมายเลขห้อง"
            className="border px-4 py-2 w-2/3 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Link
            href="/rooms/create"
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
          >
            เพิ่มข้อมูลการจอง
          </Link>
        </div>

        {currentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                  <th className="py-3 px-4 text-left">ชื่อของลูกค้า</th>
                  <th className="py-3 px-4 text-left">หมายเลขโทรศัพท์</th>
                  <th className="py-3 px-4 text-left">หมายเลขห้อง</th>
                  <th className="py-3 px-4 text-left">สถานะห้อง</th>
                  <th className="py-3 px-4 text-left">วันที่เช็คอิน</th>
                  <th className="py-3 px-4 text-left">วันที่เช็คเอาท์</th>
                  <th className="py-3 px-4 text-left">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100 odd:bg-gray-50">
                    <td className="py-3 px-4">{booking.customer_name ?? "ไม่ระบุ"}</td>
                    <td className="py-3 px-4">{booking.customer_phone ?? "ไม่ระบุ"}</td>
                    <td className="py-3 px-4">{booking.room_number ?? "ไม่ระบุ"}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">{booking.room_status === 'not_reserved' ? 'reserved' : booking.room_status}</td>
                    <td className="py-3 px-4">{booking.check_in_date ? new Date(booking.check_in_date).toLocaleDateString() : "ไม่ระบุ"}</td>
                    <td className="py-3 px-4">{booking.check_out_date ? new Date(booking.check_out_date).toLocaleDateString() : "ไม่ระบุ"}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Link
                          href={`/rooms/${booking.id}/edit`}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600"
                        >
                          แก้ไข
                        </Link>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-6 text-gray-500">ไม่มีข้อมูลการจอง</p>
        )}

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            ถัดไป
          </button>
          <span className="self-center">{currentPage} / {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  );

  function handleDelete(id) {
    Swal.fire({
      title: 'คุณต้องการลบการจองนี้หรือไม่?',
      text: "การลบไม่สามารถย้อนกลับได้",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/rooms/${id}`, {
          onSuccess: () => Swal.fire('ลบสำเร็จ!', 'การจองถูกลบแล้ว', 'success'),
        });
      }
    });
  }
}
