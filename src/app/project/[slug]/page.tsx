"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { CornerRightDown, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sceneMap } from "@/components/data/sceneMap";

const VRScene = dynamic(() => import("@/components/vr"), { ssr: false });

const projects = [
    { id: 1, slug: "shanghai-china", title: "Dự án Du Lịch", description: "Chi tiết về dự án du lịch." },
    { id: 2, slug: "du-an-cong-nghiep", title: "Dự án Công Nghiệp", description: "Chi tiết về dự án công nghiệp." },
];

export default function ProjectDetail() {
    const [currentSceneId, setCurrentSceneId] = useState("home");
    const params = useParams();
    const slug = params?.slug as string;

    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        return <div className="text-white text-center">❌ Không tìm thấy dự án</div>;
    }

    return (
        <>
            <div className="w-3/4 mx-auto pt-4">
                <h1 className=" text-default-color text-2xl pb-4">Tour du lịch Trung Quốc 5 ngày 4 đêm Thượng Hải - Tô Châu - Phúc Đán</h1>
                <div>
                    <main className="h-screen max-h-800 flex items-center justify-center bg-gray-900">
                        {/* <VRScene
                            sceneData={sceneMap[currentSceneId]}
                            onChangeScene={(newId) => setCurrentSceneId(newId)}
                        /> */}
                        <VRScene
                            sceneId={currentSceneId}
                            sceneData={sceneMap[currentSceneId]}
                            onChangeScene={setCurrentSceneId}
                            getImageById={(id) => sceneMap[id]?.image ?? ""}
                        />
                    </main>
                </div>
                {/* detail tour */}
                <div className="flex gap-5 mt-5">
                    <div className="detail_tour w-7/10">
                        <p className="text-xl font-bold mb-2">Lịch trình tour</p>
                        <div className="tour_step">
                            <div className="step_header flex justify-between mb-2">
                                <p className="step_name font-bold text-gray-500">Ngày 1: Thượng Hải</p>
                                <CornerRightDown className="w-5 text-gray-500" />
                            </div>
                            <div className="step_detail">
                                Tối: Đón quý khách tại sân bay Nội Bài, làm thủ tục cho quý khách bay đi Nhật Bản trên chuyến bay VJ938 HAN-KIX lúc 01:40.

                                Quý khách dùng bữa sáng trên máy bay của hãng hàng không VIETJET AIR và nghỉ đêm trên máy bay.
                            </div>
                        </div>
                        <div className="tour_step">
                            <div className="step_header flex justify-between mb-2">
                                <p className="step_name font-bold text-gray-500">Ngày 1: Thượng Hải</p>
                                <CornerRightDown className="w-5 text-gray-500" />
                            </div>
                            <div className="step_detail">
                                Tối: Đón quý khách tại sân bay Nội Bài, làm thủ tục cho quý khách bay đi Nhật Bản trên chuyến bay VJ938 HAN-KIX lúc 01:40.

                                Quý khách dùng bữa sáng trên máy bay của hãng hàng không VIETJET AIR và nghỉ đêm trên máy bay.
                            </div>
                        </div>
                        <div className="tour_step">
                            <div className="step_header flex justify-between mb-2">
                                <p className="step_name font-bold text-gray-500">Ngày 1: Thượng Hải</p>
                                <CornerRightDown className="w-5 text-gray-500" />
                            </div>
                            <div className="step_detail">
                                Tối: Đón quý khách tại sân bay Nội Bài, làm thủ tục cho quý khách bay đi Nhật Bản trên chuyến bay VJ938 HAN-KIX lúc 01:40.

                                Quý khách dùng bữa sáng trên máy bay của hãng hàng không VIETJET AIR và nghỉ đêm trên máy bay.
                            </div>
                        </div>
                    </div>
                    <div className="book_tour">
                        <p className="text-xl font-bold mb-2">Đặt tour</p>
                        <div className="flex flex-col gap-4">
                            <span>Ngày khởi hành: <span className="font-bold">19/03/2025</span></span>
                            <div className="flex justify-between">
                                <span>Ngày khác</span>
                                <CalendarDays className="cursor-pointer" />
                            </div>
                            <span>Số chỗ còn: <span className="font-bold">27 chỗ</span></span>
                            <div className="price">
                                <div>
                                    Nguời lớn: 31.990.000đ
                                </div>
                                <div>
                                    Nguời lớn: 31.990.000đ
                                </div>
                                <div>
                                    Nguời lớn: 31.990.000đ
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span>Tổng giá tour</span>
                                <span className="text-default-color">31.990.000đ</span>
                            </div>
                            <div className="flex justify-between">
                                <Button>Tư vấn</Button>
                                <Button>Đặt tour</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}