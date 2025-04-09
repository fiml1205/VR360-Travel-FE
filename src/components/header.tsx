"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Combobox from "./combobox";
import { Button } from "./ui/button";
import { AlignJustify, Bell, User, ChevronDown, BookOpenText, Gem, Search, X, Heart, LogOut, Smartphone, Headset, Trash2 } from "lucide-react";
import { listCity, listDistrict } from "@/utilities/constant"


export default function Header() {

    const [listCityRebuild, setListCityRebuild] = useState<any>()
    const [listDistrictRebuild, setListDistrictRebuild] = useState<any>()
    const [city, setCity] = useState<Number>()
    const [district, setDistrict] = useState<Number>()

    useEffect(() => {
        const arrayListCityRebuild = listCity.map(item => ({
            value: item._id,
            label: item.name
        }))
        setListCityRebuild(arrayListCityRebuild)
    }, []);

    const selectCity = (cityID: Number) => {
        const arrayListCityRebuild = listDistrict
            .filter(item => item.cit_parent == cityID)
            .map(item => ({
                value: item.cit_id,
                label: item.cit_name
            }))
        setListDistrictRebuild(arrayListCityRebuild)
        setCity(cityID)
    }

    const selectDistrict = (districtID: Number) => {
        setDistrict(districtID)
    }

    return (
        <>
            <div className="flex w-full items-center px-5">
                <Image src="/images/logo-site.png" alt="logo-site" width={200} height={45} />
                <div className="flex gap-4 boder">
                    <Link href='/' className="text-xl text-default-color p-1 hover:border hover:border-default-color">BLOG</Link>
                    <Link href='/' className="text-xl text-default-color p-1 hover:border hover:border-default-color">About Us</Link>
                    <Link href='/' className="text-xl text-default-color p-1 hover:border hover:border-default-color">Contact</Link>
                </div>
            </div>
            <div className="bg-[url('/images/banner.png')] w-full h-96 md:h-400px bg-cover bg-no-repeat px-5 py-12 xl:py-20 flex items-center flex-col gap-5">
                <div className="relative w-full max-w-xl">
                    <input type="text" placeholder="Nhập từ khóa tìm kiếm..." className="bg-white h-12 rounded-xl w-full max-w-xl pl-4 opacity-85" />
                    <Search className="absolute top-3 right-3 text-slate-500" />
                </div>
                <div className="w-full max-w-xl flex flex-col gap-4 lg:gap-0 lg:flex-row opacity-75">
                    <Combobox listData={listCityRebuild} placeholder={'tỉnh thành'} borderRadius={2} handleFunction={selectCity}/>
                    <Combobox listData={listDistrictRebuild} placeholder={'quận huyện'} borderRadius={1} handleFunction={selectDistrict} />
                    <Button className="lg:rounded-l-none h-12 font-semibold hover:cursor-pointer">Tìm kiếm</Button>
                </div>
            </div>
        </>
    )
}