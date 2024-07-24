import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import ShowCase from '../assets/showcase.json'
import { useNavigate } from "react-router-dom";
import SolanaPic from '../assets/SolanaPic.webp'

export const DragCards = ({ showcase }) => {

    return (
        <section className="relative grid min-h-screen w-full place-content-center overflow-hidden bg-neutral-950">
            <img src={SolanaPic} alt="Solana Pic" className='absolute top-[-2rem] left-[30rem] sm:left-[25rem] md:left-[20rem] lg:-left-[15rem] w-[20rem] h-[10rem] scale-[5]' />
            <img src={SolanaPic} alt="Solana Pic" className='absolute top-[10rem] right-[-30rem] sm:right-[-25rem] md:right-[-20rem] lg:right-[-15rem] w-[20rem] h-[10rem] scale-[5]' />
            <h2 className="relative z-0 text-[20vw] font-black text-neutral-800 md:text-[200px]">
                ShowCase<span className="text-indigo-500">.</span>
            </h2>
            <Cards />
        </section>
    );
};

const Cards = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate

    const handleNavigate = (url) => {
        navigate(url)
    }

    const getRandomRotate = () => `${Math.random() * 30 - 15}deg`;
    const getRandomTop = () => `${Math.random() * 60 + 10}%`;
    const getRandomLeft = () => `${Math.random() * 60 + 15}%`;
    return (
        <div className="absolute inset-0 z-10" ref={containerRef}>
            {ShowCase.data.map((item) => (
                <Card
                    key={item?.id}
                    containerRef={containerRef}
                    src={item?.image}
                    alt={item?.alt}
                    rotate={getRandomRotate()}
                    top={getRandomTop()}
                    left={getRandomLeft()}
                    className="w-36 md:w-56"
                    url={item?.url}
                />
            ))}
        </div>
    );
};

const Card = ({ containerRef, src, alt, top, left, rotate, className, url }) => {
    const [zIndex, setZIndex] = useState(0);

    const handleDoubleClick = () => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const updateZIndex = () => {
        const els = document.querySelectorAll(".drag-elements");

        let maxZIndex = -Infinity;

        els.forEach((el) => {
            let zIndex = parseInt(
                window.getComputedStyle(el).getPropertyValue("z-index")
            );

            if (!isNaN(zIndex) && zIndex > maxZIndex) {
                maxZIndex = zIndex;
            }
        });

        setZIndex(maxZIndex + 1);
    };

    return (
        <motion.img
            onDoubleClick={handleDoubleClick}
            onMouseDown={updateZIndex}
            style={{
                top,
                left,
                rotate,
                zIndex,
            }}
            className={twMerge(
                "drag-elements absolute w-48 bg-neutral-200 p-1 pb-4",
                className
            )}
            src={src}
            alt={alt}
            drag
            dragConstraints={containerRef}
            // Uncomment below and remove dragElastic to remove movement after release
            //   dragMomentum={false}
            dragElastic={0.65}
        />
    );
};