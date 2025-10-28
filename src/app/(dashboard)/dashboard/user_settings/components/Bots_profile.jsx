import Image from "next/image";
import React from "react";

export default function Bots_profile() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[#1D1B20] font-semibold text-2xl lg:text-4xl mb-6">
          Bots Profile
        </h1>
        <button className="underline cursor-pointer">See all</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-6">
        <div className="border p-4 rounded-2xl border-secondary shadow-[0px_10px_35px_0px_#00000008]">
          <Image
            src={"/images/bot.jpg"}
            height={221}
            width={200}
            alt="Bots Profile picture"
            className="mx-auto rounded-2xl"
          />
          <h1 className="py-2 text-xl lg:text-3xl font-semibold text-center">Name</h1>
          <div className="space-y-4">
            <h4 className="font-bold">About</h4>
            <p>
              Fun and adventurous. I'm not afraid to try new things and I love to be spontaneous. I want someone who is always up for an adventure, whether it's trying a new restaurant, going on a hike, or traveling to a new country.
            </p>
            <h4 className="font-bold">Interest</h4>
            <div className="flex flex-row gap-2 items-center">
              <span className="rounded-4xl border border-secondary text-secondary2 px-2">
                Intelligent
              </span>
              <span className="rounded-4xl border border-secondary text-secondary2 px-2">
                Intelligent
              </span>
              <span className="rounded-4xl border border-secondary text-secondary2 px-2">
                Intelligent
              </span>
            </div>
          </div>
        </div>
        <div className="border p-4 rounded-2xl border-secondary shadow-[0px_10px_35px_0px_#00000008]">
          <Image
            src={"/images/bot.jpg"}
            height={221}
            width={200}
            alt="Bots Profile picture"
            className="mx-auto rounded-2xl"
          />
          <h1 className="py-2 text-xl lg:text-3xl font-semibold text-center">Name</h1>
          <div className="space-y-4">
            <h4 className="font-bold">About</h4>
            <p>
              Fun and adventurous. I'm not afraid to try new things and I love to be spontaneous. I want someone who is always up for an adventure, whether it's trying a new restaurant, going on a hike, or traveling to a new country.
            </p>
            <h4 className="font-bold">Interest</h4>
            <div className="flex flex-row gap-2 items-center">
              <span className="rounded-4xl border border-secondary text-secondary2 px-2">
                Intelligent
              </span>
              <span className="rounded-4xl border border-secondary text-secondary2 px-2">
                Intelligent
              </span>
              <span className="rounded-4xl border border-secondary text-secondary2 px-2">
                Intelligent
              </span>
            </div>
          </div>
        </div>
        <div className="border p-4 rounded-2xl border-secondary shadow-[0px_10px_35px_0px_#00000008]">
          <Image
            src={"/images/bot.jpg"}
            height={221}
            width={200}
            alt="Bots Profile picture"
            className="mx-auto rounded-2xl"
          />
          <h1 className="py-2 text-xl lg:text-3xl font-semibold text-center">Name</h1>
          <div className="space-y-4">
            <h4 className="font-bold">About</h4>
            <p>
              Fun and adventurous. I'm not afraid to try new things and I love to be spontaneous. I want someone who is always up for an adventure, whether it's trying a new restaurant, going on a hike, or traveling to a new country.
            </p>
            <h4 className="font-bold">Interest</h4>
            <div className="flex flex-row gap-2 items-center">
              <span className="rounded-4xl border border-secondary text-secondary2 px-2">
                Intelligent
              </span>
              <span className="rounded-4xl border border-secondary text-secondary2 px-2">
                Intelligent
              </span>
              <span className="rounded-4xl border border-secondary text-secondary2 px-2">
                Intelligent
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
