"use client";

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface ToasterProps {
    title: string;
    icon: React.ReactNode;
}

const Toaster = ({ title, icon }: ToasterProps) => {
    return (
        <AnimatePresence>
            <motion.div
                className='fixed bottom-6 right-12'
                initial={{ y: 24 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className='w-fit flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black shadow-lg'>
                    {title}
                    {icon}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Toaster;
