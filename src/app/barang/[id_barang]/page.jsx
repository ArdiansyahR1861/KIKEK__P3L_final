'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function DetailBarangPage() {
    const { id_barang } = useParams();
    const [barang, setBarang] = useState(null);
    const [previewImg, setPreviewImg] = useState('');
    const [uniqueImages, setUniqueImages] = useState([]);

    useEffect(() => {
        const fetchBarang = async () => {
            const res = await fetch(`/api/barang/${id_barang}`);
            const data = await res.json();
            if (data.barang) {
                setBarang(data.barang);
                if (data.barang.gambar_barang.length > 0) {
                    setPreviewImg(data.barang.gambar_barang[0].src_img);
                    const uniqueImgs = Array.from(new Set(data.barang.gambar_barang.map((item) => item.src_img)))
                        .map((src_img) => data.barang.gambar_barang.find((item) => item.src_img === src_img));
                    setUniqueImages(uniqueImgs);
                }
            }
        };
        fetchBarang();
    }, [id_barang]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (!barang) return <div className="px-6 mt-24">Loading data barang...</div>;

    return (
        <div className="px-10 md:px-20 ">
            <div className="grid md:grid-cols-3 gap-6">
                <div className=''>
                    <div className="mb-4">
                        <img
                            src={previewImg || '/images/default-image.jpg'}
                            alt={barang.nama_barang}
                            className="w-lg h-[500px] object-cover rounded-2xl border-5 border-[#D2CBB1]"
                        />
                    </div>
                    <div className="flex gap-2">
                        {uniqueImages.map((gambar, index) => (
                            <img
                                key={`${gambar.id_gambar}-${index}`}
                                src={gambar.src_img}
                                alt="Thumbnail"
                                onClick={() => setPreviewImg(gambar.src_img)}
                                className={`w-16 h-16 object-cover rounded-xl cursor-pointer ${
                                    previewImg === gambar.src_img ? 'ring-3 ring-[#D2CBB1]' : ''
                                }`}
                            />
                        ))}
                    </div>
                </div>
                <div className='col-span-2'>
                    <h1 className="text-5xl font-bold mb-3 text-[#D2CBB1]">{barang.nama_barang}</h1>
                    <p className="text-3xl font-semibold mb-4 text-[#D2CBB1]">{formatPrice(barang.harga_barang)}</p>
                    <p className='text-xl font-semibold text-[#D2CBB1] mb-4'>kategori : {barang.kategori_barang}</p>
                    <div className="flex gap-4 mb-4">
                        <button className="text-2xl font-bold px-6 py-2 w-full rounded-4xl border-[#D2CBB1] border-1 text-[#D2CBB1]">
                            + Keranjang
                        </button>
                        <button className="text-2xl font-bold px-6 py-2 w-full rounded-4xl bg-[#D2CBB1] text-[#273529]">
                            Beli Sekarang
                        </button>
                    
                    </div>
                    <p className="mt-4 text-[#D2CBB1] text-2xl font-semibold">Deskripsi : <br /> {barang.deskripsi_barang}</p>
                </div>
            </div>
        </div>
    );
}
