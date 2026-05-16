import { Head, Link } from '@inertiajs/react';

const mockProducts = {
    Mac: [
        { id: 1, name: 'MacBook Air M2', price: '₱69,990', img: 'https://powermaccenter.com/cdn/shop/files/MacBook_Air_13_in_Midnight_PDP_Image_Position-1__WWEN-removebg-preview_550x.png?v=1754530384' },
        { id: 2, name: 'MacBook Pro 14"', price: '₱126,990', img: 'https://powermaccenter.com/cdn/shop/files/MacBook_Pro_14-inch_M4_Pro_or_Max_chip_Space_Black_PDP_Image_Position_1__WWEN_550x.jpg?v=1730311883' },
        { id: 3, name: 'iMac 24"', price: '₱89,990', img: 'https://powermaccenter.com/cdn/shop/files/iMac_M4_Chip_2-port_24-in_Blue_PDP_Image_Position_1__WWEN_550x.jpg?v=1730312583' },
        { id: 4, name: 'Macbook Neo', price: '₱43,990', img: 'https://powermaccenter.com/cdn/shop/files/IMG-19296584_m_jpeg_1.jpg?v=1772637556&width=2048' },
    ],
    iPad: [
        { id: 5, name: 'iPad Pro M4', price: '₱65,990', img: 'https://powermaccenter.com/cdn/shop/files/iPad_Pro_11_M4_WiFi_Space_Black_PDP_Image_Position_1a__en-US_550x.jpg?v=1716467258' },
        { id: 6, name: 'iPad Air M2', price: '₱42,990', img: 'https://powermaccenter.com/cdn/shop/files/iPad_Air_13_M2_Cellular_Blue_PDP_Image_Position_1__en-US_61df4d7d-6789-40d7-9285-e7bdb006f9a8_550x.jpg?v=1716471309' },
        { id: 7, name: 'iPad (10th gen)', price: '₱29,990', img: 'https://powermaccenter.com/cdn/shop/files/iPad_10th_generation_Cellular_Pink_PDP_Image_Fall23_Position-1__en-US_c56fdf05-bb8b-4dae-ba51-3ca448d9c63b.jpg?v=1718803297&width=1680' },
        { id: 8, name: 'iPad mini', price: '₱32,990', img: 'https://powermaccenter.com/cdn/shop/files/iPad_mini_Starlight_PDP_Image_Position_1_WiFi__WWEN_80668cee-2100-42cf-b940-db9078ef7ef2_550x.jpg?v=1729009377' },
    ],
    iPhone: [
        { id: 9, name: 'iPhone 15 Pro', price: '₱70,990', img: 'https://powermaccenter.com/cdn/shop/files/iPhone_15_Pink_PDP_Image_Position-1__en-US_4a37db5a-bfe1-4d20-b5b1-0e787116a06a__1_-removebg-preview_550x.png?v=1754530571' },
        { id: 10, name: 'iPhone 15', price: '₱56,990', img: 'https://powermaccenter.com/cdn/shop/files/iPhone_15_Blue_PDP_Image_Position-1_alt__en-US_02e4c4c3-f631-4168-974a-f03c82c9984a_360x.jpg?v=1695852648' },
        { id: 11, name: 'iPhone 14', price: '₱49,990', img: 'https://powermaccenter.com/cdn/shop/files/iPhone_14_Starlight_PDP_Image_Position-1A__en-US_94c7593e-f378-4f93-82e5-cab8c0e63b49_550x.jpg?v=1705402257' },
        { id: 12, name: 'iPhone 13', price: '₱42,990', img: 'https://powermaccenter.com/cdn/shop/files/iPhone_13_Pink_PDP_Image_Position-1A__en-US_ff5f581b-f8ee-423e-99ec-f4d2835d55ec.jpg?v=1692028791&width=1680' },
    ],
    Watch: [
        { id: 13, name: 'Apple Watch Series 9', price: '₱26,990', img: 'https://powermaccenter.com/cdn/shop/files/Apple_Watch_Series_9_LTE_41mm_Pink_Aluminum_Light_Pink_Sport_Band_PDP_Image_Position-1__en-US_550x.jpg?v=1699529504' },
        { id: 14, name: 'Apple Watch Ultra 2', price: '₱54,990', img: 'https://powermaccenter.com/cdn/shop/files/Apple_Watch_Ultra_2_LTE_49mm_Titanium_Beige_Orange_Trail_Loop_PDP_Image_Position-1__en-US_550x.jpg?v=1699532088' },
        { id: 15, name: 'Apple Watch SE', price: '₱16,990', img: 'https://powermaccenter.com/cdn/shop/files/IMG-18080319_m_jpeg_1_9e16f459-4d39-4ee5-80d5-7f3042970091_550x.jpg?v=1757470808' },
        { id: 16, name: 'Apple Watch Ultra 3 Milanese Loop', price: '₱60,990', img: 'https://powermaccenter.com/cdn/shop/files/IMG-18081317_m_jpeg_1_68268f52-0e55-48bd-9aa7-6b56172c463f_550x.jpg?v=1757470715' },
    ]
};

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Head title="Welcome" />

            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tighter">PMC</h1>
                    <span className="text-[10px] font-semibold px-2 py-1 border border-gray-200 rounded-md text-gray-600">Premium Partner</span>
                </div>
                <div className="flex items-center gap-6">
                    {auth.user ? (
                        <div className="flex items-center gap-4">
                            <Link href={route('dashboard')} className="text-sm font-medium text-gray-700 hover:text-black">Dashboard</Link>
                            <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-red-500 hover:text-red-700 transition">
                                Log out
                            </Link>
                        </div>
                    ) : (
                        <Link href={route('login')} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Log in
                        </Link>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-[#dcebfa] to-[#f4f8fc] pt-24 pb-32 px-8 overflow-hidden">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center relative z-10">
                    <div className="md:w-1/2 text-center md:text-left z-10 flex flex-col items-center md:items-start">
                        <h2 className="text-[#5287c7] text-4xl md:text-[3.5rem] font-black tracking-tighter mb-6">
                            Smooth, fast, effortless.
                        </h2>
                        <div className="inline-block text-[10px] font-bold text-[#d97706] tracking-widest uppercase mb-2">New</div>
                        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-3">iPad Air M4</h1>
                        <p className="text-gray-500 mb-8 font-medium">Now supercharged by M4. Starts at ₱42,990.</p>
                        <button className="px-8 py-2.5 rounded-full border border-[#b0c4de] bg-[#dcebfa]/50 text-sm font-medium hover:bg-[#b0c4de]/50 transition text-gray-800 shadow-sm">
                            Buy now
                        </button>
                    </div>
                    <div className="md:w-1/2 mt-16 md:mt-0 relative flex justify-center">
                        <div className="relative w-full max-w-[500px]">
                            <img
                                src="https://powermaccenter.com/cdn/shop/files/iPad_Air_M4_Chip_Wi-Fi_Hero_Horizontal_Screen__USEN_750x.webp?v=1774310691"
                                alt="iPad Air M4"
                                className="w-full h-auto object-contain transform md:scale-110 drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-[2rem] px-8 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex flex-col items-center z-20 cursor-pointer hover:shadow-lg transition">
                    <span className="text-sm font-medium text-gray-800">View more products</span>
                    <svg className="w-4 h-4 text-gray-800 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </div>
            </div>

            {/* Categories */}
            <div className="max-w-5xl mx-auto px-8 pt-24 pb-16">
                <div className="flex flex-wrap justify-center md:justify-between gap-8 text-center">
                    {[
                        { name: 'Mac', price: '₱35,990', img: 'https://powermaccenter.com/cdn/shop/files/MacBook_Pro_14-inch_M4_Pro_or_Max_chip_Space_Black_PDP_Image_Position_1__WWEN_550x.jpg?v=1730311883' },
                        { name: 'iPhone', price: '₱24,990', img: 'https://powermaccenter.com/cdn/shop/files/IMG-18066223_m_jpeg_1_550x.jpg?v=1757470625' },
                        { name: 'iPad', price: '₱18,990', img: 'https://powermaccenter.com/cdn/shop/files/IMG-18291528_m_jpeg_1_863f1b34-0e55-4fae-8392-e840b4ec96f6_550x.jpg?v=1760537608' },
                        { name: 'WATCH', price: '₱9,000', img: 'https://powermaccenter.com/cdn/shop/files/IMG-18081317_m_jpeg_1_68268f52-0e55-48bd-9aa7-6b56172c463f_550x.jpg?v=1757470715' },
                        { name: 'Music', price: '₱8,190', img: 'https://powermaccenter.com/cdn/shop/files/IMG-18062379_m_jpeg_1.jpg?v=1757470806&width=1680' },
                        { name: 'TV & Home', price: '₱6,000', img: 'https://powermaccenter.com/cdn/shop/files/TV-LOB-Hero_ATV_4K2_750x.jpg?v=1690975852' },
                        { name: 'Accessories', price: '₱100', img: 'https://powermaccenter.com/cdn/shop/files/MGTR4PA_A-001.jpg?v=1762149416&width=1680' },
                        { name: 'AirTag', price: '₱1,890', img: 'https://powermaccenter.com/cdn/shop/files/Airtag-LOB-2_Airtag_4pack.webp?v=1691588116&width=550' },
                    ].map((cat, i) => (
                        <div key={i} className="flex flex-col items-center group cursor-pointer w-[80px]">
                            <div className="mb-3 transform group-hover:-translate-y-2 transition duration-300 drop-shadow-sm w-12 h-12 flex items-center justify-center">
                                <img src={cat.img} alt={cat.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <span className="text-xs font-semibold text-black">{cat.name}</span>
                            <span className="text-[10px] text-gray-500 mt-0.5">From {cat.price}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sections */}
            <div className="max-w-6xl mx-auto px-8 py-12 space-y-32 mb-16">
                {Object.entries(mockProducts).map(([category, products]) => (
                    <div key={category}>
                        <h2 className="text-2xl font-medium mb-12">{category}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {products.map(product => (
                                <div key={product.id} className="flex flex-col items-center group cursor-pointer">
                                    <div className="bg-[#f5f5f7] rounded-3xl p-6 mb-6 w-full aspect-square flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                                        <img src={product.img} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <h3 className="font-semibold text-[15px] text-center text-black mb-1">{product.name}</h3>
                                    <p className="text-xs text-gray-500">From {product.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Features Footer */}
            <div className="bg-[#f5f5f7] py-20 px-8 border-t border-gray-100">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <svg className="w-8 h-8 text-[#3b82f6] mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        <h3 className="font-semibold text-[15px] mb-2 text-black">Installment Options</h3>
                        <p className="text-xs text-gray-500 px-6 leading-relaxed">Make that Apple dream a reality with easier ways to finance your purchase.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <svg className="w-8 h-8 text-[#3b82f6] mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <h3 className="font-semibold text-[15px] mb-2 text-black">The Safest Way to Buy</h3>
                        <p className="text-xs text-gray-500 px-6 leading-relaxed">Your online experience and data security is our priority.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <svg className="w-8 h-8 text-[#3b82f6] mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                        <h3 className="font-semibold text-[15px] mb-2 text-black">Express Shipping</h3>
                        <p className="text-xs text-gray-500 px-6 leading-relaxed">Avail of same-day shipping for orders within Metro Manila.</p>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <footer className="bg-white py-16 px-8 border-t border-gray-100 text-xs">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
                    {/* Links Columns */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 flex-1">
                        <div>
                            <h4 className="font-semibold text-black mb-4 text-[13px]">Products</h4>
                            <ul className="space-y-3 text-gray-500">
                                <li><a href="#" className="hover:text-black">Mac</a></li>
                                <li><a href="#" className="hover:text-black">iPad</a></li>
                                <li><a href="#" className="hover:text-black">iPhone</a></li>
                                <li><a href="#" className="hover:text-black">Watch</a></li>
                                <li><a href="#" className="hover:text-black">Music</a></li>
                                <li><a href="#" className="hover:text-black">TV & Home</a></li>
                                <li><a href="#" className="hover:text-black">Accessories</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-black mb-4 text-[13px]">Services</h4>
                            <ul className="space-y-3 text-gray-500">
                                <li><a href="#" className="hover:text-black">AppleCare</a></li>
                                <li><a href="#" className="hover:text-black">Protect Plus</a></li>
                                <li><a href="#" className="hover:text-black">Loyalty</a></li>
                                <li><a href="#" className="hover:text-black">Training</a></li>
                                <li><a href="#" className="hover:text-black">Enterprise</a></li>
                                <li><a href="#" className="hover:text-black">Education</a></li>
                                <li><a href="#" className="hover:text-black">Device Trade-in</a></li>
                                <li><a href="#" className="hover:text-black">Free In-Store Training</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-black mb-4 text-[13px]">Support</h4>
                            <ul className="space-y-3 text-gray-500">
                                <li><a href="#" className="hover:text-black">Contact Us</a></li>
                                <li><a href="#" className="hover:text-black">Return an Item</a></li>
                                <li><a href="#" className="hover:text-black">Blogs</a></li>
                                <li><a href="#" className="hover:text-black">News</a></li>
                                <li><a href="#" className="hover:text-black">Locations</a></li>
                                <li><a href="#" className="hover:text-black">FAQs</a></li>
                                <li><a href="#" className="hover:text-black">Installment Options</a></li>
                                <li><a href="#" className="hover:text-black">Device Enrollment Program</a></li>
                                <li><a href="#" className="hover:text-black">Mobile Care</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-black mb-4 text-[13px]">Legal</h4>
                            <ul className="space-y-3 text-gray-500">
                                <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-black">Terms & Conditions</a></li>
                                <li><a href="#" className="hover:text-black">Delivery & Shipping</a></li>
                                <li><a href="#" className="hover:text-black">Return & Refund</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-black mb-4 text-[13px]">About Us</h4>
                            <ul className="space-y-3 text-gray-500">
                                <li><a href="#" className="hover:text-black">Who We Are</a></li>
                                <li><a href="#" className="hover:text-black">Join Our Team</a></li>
                                <li><a href="#" className="hover:text-black">Viber Community</a></li>
                            </ul>

                            {/* Badges placeholder */}
                            <div className="mt-6 space-y-3">
                                <div className="border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-2 w-max">
                                    <span className="text-[10px] font-semibold text-gray-600">Premium Partner</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0"></span>
                                    <span className="text-[10px] text-gray-600 font-semibold leading-tight">Authorized<br />Reseller</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0"></span>
                                    <span className="text-[10px] text-gray-600 font-semibold leading-tight">Authorized<br />Service Provider</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0"></span>
                                    <span className="text-[10px] text-gray-600 font-semibold leading-tight">Professional Learning<br />Provider</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto mt-16 pt-8 flex flex-col md:flex-row justify-between items-end gap-6 border-t border-gray-50">
                    <div>
                        <h4 className="text-gray-500 mb-3 text-[13px]">Subscribe to our emails</h4>
                        <div className="relative w-72">
                            <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-none px-4 py-2.5 text-sm outline-none focus:border-black transition" />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        <div className="flex gap-4 text-gray-600">
                            <svg className="w-4 h-4 hover:text-black cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            <svg className="w-4 h-4 hover:text-black cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                            <svg className="w-4 h-4 hover:text-black cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                        </div>
                        <p className="text-[10px] text-gray-500">© 2026, Power Mac Center | Apple Premium Partner</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
