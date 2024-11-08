"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface ToasterProps {
    title: string;
    icon: React.ReactNode;
}

const Toaster = ({ title, icon }: ToasterProps) => {
    const [isVisible, setIsVisible] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className='fixed bottom-6 right-12'
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className='w-fit flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black shadow-lg'>
                        {title}
                        {icon}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toaster;
