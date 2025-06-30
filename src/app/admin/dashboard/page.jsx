"use client";
import { useEffect, useRef, useState } from "react";
import { Download, FileText, DollarSign, Package, TrendingUp } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Chart from 'chart.js/auto';


export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [tahun, setTahun] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/laporan/dashboard?tahun=${tahun}`);
                const json = await res.json();
                if (json.success) setData(json);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tahun]);

    const calculateTotalPenjualan = () => {
        if (!data?.penjualan?.length) return 0;
        return data.penjualan.reduce((sum, item) => sum + (item.jumlah_penjualan || 0), 0);
    };

    const generateBarChartImage = async () => {
        return new Promise((resolve) => {
            const ctx = chartRef.current.getContext('2d');
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
            chartInstanceRef.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.penjualan.map(d => d.bulan),
                    datasets: [
                        {
                            label: 'Penjualan (Rp)',
                            data: data.penjualan.map(d => d.jumlah_penjualan),
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: false,
                    plugins: {
                        legend: { display: false },
                    },
                },
            });
            setTimeout(() => {
                const imgData = chartRef.current.toDataURL('image/png');
                resolve(imgData);
            }, 500);
        });
    };

    const downloadPenjualanBulananPDF = async () => {
        if (!data?.penjualan?.length) return;

        const doc = new jsPDF();
        const today = new Date().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
        });

        doc.setFontSize(12);
        doc.text("ReUse Mart", 14, 14);
        doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 14, 20);
        doc.setFontSize(14);
        doc.text("LAPORAN PENJUALAN BULANAN", 14, 30);

        doc.setFontSize(12);
        doc.text(`Tahun : ${tahun}`, 14, 38);
        doc.text(`Tanggal cetak: ${today}`, 14, 44);

        const tableData = data.penjualan.map(d => [
            d.bulan,
            d.jumlah_terjual.toLocaleString("id-ID"),
            d.jumlah_penjualan.toLocaleString("id-ID"),
        ]);

        const totalJumlah = data.penjualan.reduce((sum, d) => sum + d.jumlah_terjual, 0);
        const totalPenjualan = data.penjualan.reduce((sum, d) => sum + d.jumlah_penjualan, 0);

        autoTable(doc, {
            startY: 50,
            head: [["Bulan", "Jumlah Barang Terjual", "Jumlah Penjualan Kotor"]],
            body: [
                ...tableData,
                ["Total", totalJumlah.toLocaleString("id-ID"), totalPenjualan.toLocaleString("id-ID")],
            ],
            styles: { halign: 'center' },
            headStyles: { fillColor: [40, 40, 40] },
            didParseCell: (data) => {
                if (data.row.index === tableData.length) {
                    data.cell.styles.fillColor = [220, 220, 220];
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.textColor = [0, 0, 0];
                }
            },
        });

        const chartImage = await generateBarChartImage();
        doc.addPage();
        doc.addImage(chartImage, 'PNG', 10, 20, 190, 100);
        doc.save(`Laporan_Penjualan_Bulanan_${tahun}.pdf`);
    };

    const downloadKomisiProdukPDF = () => {
        if (!data?.komisi?.length) return;
        const doc = new jsPDF();
        const today = new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        doc.setFontSize(12);
        doc.text("ReUse Mart", 14, 14);
        doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 14, 20);
        doc.setFontSize(14);
        doc.text("LAPORAN KOMISI PRODUK", 14, 30);

        doc.setFontSize(12);
        doc.text(`Tahun : ${tahun}`, 14, 38);
        doc.text(`Tanggal cetak: ${today}`, 14, 44);

        let totalHarga = 0;
        let totalHunter = 0;
        let totalReusemart = 0;
        let totalPenitip = 0;

        const tableData = data.komisi.map(row => {
            totalHarga += row.harga_jual;
            totalHunter += row.komisi_hunter;
            totalReusemart += row.komisi_reusemart;
            totalPenitip += row.komisi_penitip;
            return [
                `${row.id_barang}${row.nama_barang[0]}`,
                row.nama_barang,
                `Rp ${row.harga_jual.toLocaleString("id-ID")}`,
                new Date(row.tanggal_masuk).toLocaleDateString("id-ID"),
                new Date(row.tanggal_laku).toLocaleDateString("id-ID"),
                `Rp ${row.komisi_hunter.toLocaleString("id-ID")}`,
                `Rp ${row.komisi_reusemart.toLocaleString("id-ID")}`,
                `Rp ${row.komisi_penitip.toLocaleString("id-ID")}`
            ];
        });

        const totalRow = [
            "TOTAL",
            "",
            `Rp ${totalHarga.toLocaleString("id-ID")}`,
            "",
            "",
            `Rp ${totalHunter.toLocaleString("id-ID")}`,
            `Rp ${totalReusemart.toLocaleString("id-ID")}`,
            `Rp ${totalPenitip.toLocaleString("id-ID")}`
        ];

        autoTable(doc, {
            startY: 50,
            head: [[
                "Kode Produk",
                "Nama Produk",
                "Harga Jual",
                "Tanggal Masuk",
                "Tanggal Laku",
                "Komisi Hunter",
                "Komisi ReUse Mart",
                "Bonus Penitip"
            ]],
            body: [...tableData, totalRow],
            styles: { fontSize: 10, halign: 'center' },
            headStyles: { fillColor: [40, 40, 40] },
            didParseCell: function (data) {
                if (data.row.index === tableData.length) {
                    data.cell.styles.fillColor = [220, 220, 220];
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });

        doc.save(`Laporan_Komisi_Produk_${tahun}.pdf`);
    };

    const downloadStokGudangPDF = () => {
        if (!data?.stok?.length) return;
        const doc = new jsPDF();
        const today = new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        doc.setFontSize(12);
        doc.text("ReUse Mart", 14, 14);
        doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 14, 20);
        doc.setFontSize(14);
        doc.text("LAPORAN STOK GUDANG", 14, 30);

        doc.setFontSize(12);
        doc.text(`Tanggal cetak: ${today}`, 14, 38);

        autoTable(doc, {
            startY: 46,
            head: [[
                "Kode Produk",
                "Nama Produk",
                "ID Penitip",
                "Nama Penitip",
                "Tanggal Masuk",
                "Perpanjangan",
                "ID Hunter",
                "Nama Hunter",
                "Harga"
            ]],
            body: data.stok.map(row => [
                `${row.nama_barang[0]}${row.id_barang}`,
                row.nama_barang,
                row.id_penitip,
                row.nama_penitip,
                new Date(row.tanggal_masuk).toLocaleDateString("id-ID"),
                row.extend === 1 ? "Ya" : "Tidak",
                row.id_hunter ? `P${row.id_hunter}` : "-",
                row.nama_hunter,
                `Rp ${row.harga_satuan.toLocaleString("id-ID")}`
            ]),
            styles: { fontSize: 10, halign: 'center' },
            headStyles: { fillColor: [40, 40, 40] }
        });

        doc.save(`Laporan_Stok_Gudang.pdf`);
    };

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-indigo-700 mb-4 flex items-center gap-3">
                    <FileText className="h-8 w-8" />
                    Dashboard Laporan Admin
                </h1>
                <div className="flex items-center gap-4">
                    <label htmlFor="tahun" className="font-medium text-gray-700">Tahun:</label>
                    <select
                        id="tahun"
                        value={tahun}
                        onChange={(e) => setTahun(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {Array.from({ length: 6 }, (_, i) => 2020 + i).map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100">Total Penjualan {tahun}</p>
                            <p className="text-2xl font-bold">Rp {calculateTotalPenjualan().toLocaleString("id-ID")}</p>
                        </div>
                        <DollarSign className="h-10 w-10 text-blue-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">Total Transaksi</p>
                            <p className="text-2xl font-bold">{data?.komisi?.length || 0}</p>
                        </div>
                        <TrendingUp className="h-10 w-10 text-green-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100">Stok Tersedia</p>
                            <p className="text-2xl font-bold">{data?.stok?.length || 0}</p>
                        </div>
                        <Package className="h-10 w-10 text-purple-200" />
                    </div>
                </div>
            </div>

            <section className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                        Penjualan Bulanan ({tahun})
                    </h2>
                    <button
                        onClick={downloadPenjualanBulananPDF}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Download PDF
                    </button>
                </div>
                {data?.penjualan?.length ? (
                    <>
                        <div className="overflow-hidden rounded-lg border border-gray-200 mb-6">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bulan</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jumlah Terjual</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Penjualan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.penjualan.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.bulan} {tahun}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 text-right">{item.jumlah_terjual.toLocaleString("id-ID")}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">Rp {item.jumlah_penjualan.toLocaleString("id-ID")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <canvas ref={chartRef} width={800} height={300}></canvas>
                    </>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Tidak ada data penjualan bulanan.</p>
                    </div>
                )}
            </section>

            {/* Komisi Produk */}
            <section className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        Komisi Produk ({tahun})
                    </h2>
                    <button
                        onClick={downloadKomisiProdukPDF}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Download PDF
                    </button>
                </div>
                {data?.komisi?.length ? (
                    <div className="overflow-x-auto">
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hunter</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">ReuseMart</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Penitip</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.komisi.map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-900 font-medium">{row.nama_barang}</td>
                                            <td className="px-4 py-3 text-gray-900 text-right">Rp {row.komisi_hunter.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-gray-900 text-right">Rp {row.komisi_reusemart.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-gray-900 text-right">Rp {row.komisi_penitip.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-gray-900 text-center">{new Date(row.tanggal).toLocaleDateString("id-ID")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Tidak ada data komisi produk.</p>
                    </div>
                )}
            </section>

            {/* Stok Gudang */}
            <section className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Package className="h-5 w-5 text-purple-600" />
                        Stok Gudang
                    </h2>
                    <button
                        onClick={downloadStokGudangPDF}
                        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Download PDF
                    </button>
                </div>
                {data?.stok?.length ? (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.stok.map((item) => (
                                    <tr key={item.id_barang} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-center text-gray-900 font-medium">{item.id_barang}</td>
                                        <td className="px-4 py-3 text-gray-900">{item.nama_barang}</td>
                                        <td className="px-4 py-3 text-gray-900">{item.kategori}</td>
                                        <td className="px-4 py-3 text-gray-900 text-right font-medium">Rp {item.harga_satuan.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Tidak ada data stok gudang.</p>
                    </div>
                )}
            </section>
        </div>
    );
}