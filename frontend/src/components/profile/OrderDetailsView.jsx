import React, { useState } from 'react';
import {
  ArrowLeft,
  UtensilsCrossed,
  ShieldCheck,
  CreditCard,
  Lock,
  FileText,
  ConciergeBell,
  CheckCircle2,
} from 'lucide-react';

export default function OrderDetailsView({ orderId = '#ORD-1048', onBack, onReorder }) {
  const [reorderStatus, setReorderStatus] = useState(false);

  const ordersDictionary = {
    '#ORD-1048': {
      id: '#ORD-1048',
      placedDate: '05 October 2026, 19:45',
      kitchen: 'Hearth Kitchen Galle Fort',
      status: 'COMPLETED',
      coursesCount: '3 COURSES',
      items: [
        {
          id: 1,
          name: 'Chicken Kottu',
          categoryTag: 'Artisanal Hearth',
          description: 'Traditional shredded godamba roti, pasture chicken, aromatic Ceylon curry leaves',
          qty: 2,
          unitPrice: 'LKR 1,450',
          totalPrice: 'LKR 2,900',
          image: '/images/dishes/chicken-kottu.jpg',
        },
        {
          id: 2,
          name: 'Fresh Lime Juice',
          categoryTag: 'Cold Elixir',
          description: 'Cold-pressed local key limes, Himalayan salt, kithul nectar',
          qty: 1,
          unitPrice: 'LKR 450',
          totalPrice: 'LKR 450',
          image: '/images/dishes/fresh-lime-juice.jpg',
        },
        {
          id: 3,
          name: 'Spiced Chicken Wings',
          categoryTag: 'Wood Ember',
          description: 'Tamarind and crushed Ceylon black pepper glaze, toasted sesame',
          qty: 1,
          unitPrice: 'LKR 1,500',
          totalPrice: 'LKR 1,500',
          image: '/images/dishes/spiced-chicken-wings.jpg',
        },
      ],
      patronName: 'Thrishala Weerasekara',
      phone: '077 123 4567',
      email: 'thrishala@example.lk',
      address: '45 Temple Road, Colombo 05',
      courier: 'Private White-Glove Dining Courier',
      subtotal: 'LKR 4,850',
      deliveryFee: 'COMPLIMENTARY',
      tax: 'Included (10%)',
      totalSettled: 'LKR 4,850',
      cardLast4: '4291',
    },
    '#ORD-1052': {
      id: '#ORD-1052',
      placedDate: 'Today, 14:20',
      kitchen: 'Hearth Kitchen Colombo Salon',
      status: 'PREPARING',
      coursesCount: '2 COURSES',
      items: [
        {
          id: 1,
          name: 'Artisanal Dutch Burgher Lamprais',
          categoryTag: 'Heritage Batch',
          description: 'Steamed yellow rice in banana leaf, mixed meat curry, frikkadel meatball, ash plantain, blachan',
          qty: 1,
          unitPrice: 'LKR 1,650',
          totalPrice: 'LKR 1,650',
          image: '/images/dishes/lamprais.jpg',
        },
        {
          id: 2,
          name: 'Spiced Ceylon Ginger Tea Reserve',
          categoryTag: 'Heated Elixir',
          description: 'Artisanal high-grown Ceylon black tea, fresh crushed highland ginger, artisanal kithul jaggery',
          qty: 2,
          unitPrice: 'LKR 1,225',
          totalPrice: 'LKR 2,450',
          image: '/images/dishes/fresh-lime-juice.jpg',
        },
      ],
      patronName: 'Thrishala Weerasekara',
      phone: '077 123 4567',
      email: 'thrishala@example.lk',
      address: '45 Temple Road, Colombo 05',
      courier: 'Private White-Glove Dining Courier',
      subtotal: 'LKR 4,100',
      deliveryFee: 'COMPLIMENTARY',
      tax: 'Included (10%)',
      totalSettled: 'LKR 4,100',
      cardLast4: '4291',
    },
    '#ORD-0988': {
      id: '#ORD-0988',
      placedDate: '18 September 2026, 20:10',
      kitchen: 'Hearth Kitchen Negombo Lagoon',
      status: 'COMPLETED',
      coursesCount: '2 COURSES',
      items: [
        {
          id: 1,
          name: 'Seafood Fried Rice',
          categoryTag: 'Lagoon Catch',
          description: 'Jasmine rice wok-fried with wild Negombo lagoon prawns, cuttlefish morsels, young scallions, and spices',
          qty: 1,
          unitPrice: 'LKR 1,850',
          totalPrice: 'LKR 1,850',
          image: '/images/dishes/seafood-fried-rice.jpg',
        },
        {
          id: 2,
          name: 'Hot Butter Cuttlefish',
          categoryTag: 'Wood Ember',
          description: 'Crisp battered lagoon cuttlefish tossed in cultured butter, dried chilies, and scallions',
          qty: 1,
          unitPrice: 'LKR 2,200',
          totalPrice: 'LKR 2,200',
          image: '/images/dishes/spiced-chicken-wings.jpg',
        },
      ],
      patronName: 'Thrishala Weerasekara',
      phone: '077 123 4567',
      email: 'thrishala@example.lk',
      address: '45 Temple Road, Colombo 05',
      courier: 'Private White-Glove Dining Courier',
      subtotal: 'LKR 4,050',
      deliveryFee: 'COMPLIMENTARY',
      tax: 'Included (10%)',
      totalSettled: 'LKR 4,050',
      cardLast4: '4291',
    },
    '#ORD-0891': {
      id: '#ORD-0891',
      placedDate: '22 August 2026, 19:15',
      kitchen: 'Hearth Kitchen Galle Fort',
      status: 'COMPLETED',
      coursesCount: '2 COURSES',
      items: [
        {
          id: 1,
          name: 'Ceylon Spiced Mutton Biryani',
          categoryTag: 'Artisanal Hearth',
          description: 'Slow-cooked spiced pasture mutton, fragrant seeraga samba rice, mint raita, Malay pickle',
          qty: 1,
          unitPrice: 'LKR 1,500',
          totalPrice: 'LKR 1,500',
          image: '/images/dishes/chicken-kottu.jpg',
        },
        {
          id: 2,
          name: 'Fresh Lime Juice',
          categoryTag: 'Cold Elixir',
          description: 'Cold-pressed local key limes, Himalayan salt, kithul nectar',
          qty: 2,
          unitPrice: 'LKR 450',
          totalPrice: 'LKR 900',
          image: '/images/dishes/fresh-lime-juice.jpg',
        },
      ],
      patronName: 'Thrishala Weerasekara',
      phone: '077 123 4567',
      email: 'thrishala@example.lk',
      address: '45 Temple Road, Colombo 05',
      courier: 'Private White-Glove Dining Courier',
      subtotal: 'LKR 2,400',
      deliveryFee: 'COMPLIMENTARY',
      tax: 'Included (10%)',
      totalSettled: 'LKR 2,400',
      cardLast4: '4291',
    },
  };

  const orderDetails = ordersDictionary[orderId] || ordersDictionary['#ORD-1048'];

  const handleReorder = () => {
    if (onReorder) {
      onReorder(orderDetails);
    }
    setReorderStatus(true);
    setTimeout(() => setReorderStatus(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ─── Back Button ─── */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>BACK TO MY ORDERS</span>
        </button>
      </div>

      {/* ─── Header & Order Meta ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-[2px] bg-[#e66200]" />
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#e66200] font-medium">
              PATRON GASTRONOMIC FOLIO
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-wide">
            Order Details
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-sans mt-2">
            <span className="text-white font-medium">Order ID: {orderDetails.id}</span>
            <span className="text-neutral-600">•</span>
            <span>Placed on {orderDetails.placedDate}</span>
            <span className="text-neutral-600">•</span>
            <span>{orderDetails.kitchen}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {orderDetails.status === 'PREPARING' ? (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <span>PREPARING</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>COMPLETED</span>
            </span>
          )}
        </div>
      </div>

      {reorderStatus && (
        <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#e66200] text-xs flex items-center gap-2.5 animate-slide-down">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>All 3 tasting courses re-added to your active dining folio.</span>
        </div>
      )}

      {/* ─── Ordered Items Section ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl sm:text-2xl text-white">
              Ordered Items
            </h2>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-[#22160f] text-[#e66200] border border-[#e66200]/30">
              {orderDetails.coursesCount}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.18em] uppercase text-neutral-500 font-medium">
            DEGUSTATION DISPATCH
          </span>
        </div>

        {/* Dish Items List */}
        <div className="space-y-4">
          {orderDetails.items.map((item) => (
            <div
              key={item.id}
              className="bg-[#141416] border border-white/[0.08] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-white/20 transition-all duration-300 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover bg-neutral-900 border border-white/10 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-lg sm:text-xl text-white font-normal">
                      {item.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] text-neutral-300 font-sans">
                      {item.categoryTag}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                  <p className="text-xs text-neutral-400 font-sans pt-1">
                    Qty: <span className="text-white font-medium">{item.qty}</span>
                    <span className="text-neutral-600 mx-2">•</span>
                    {item.unitPrice} each
                  </p>
                </div>
              </div>

              {/* Price on right */}
              <div className="sm:text-right shrink-0">
                <span className="font-serif text-xl sm:text-2xl text-white tracking-wide font-normal">
                  {item.totalPrice}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 2 Summary Cards (Delivery & Contact + Payment & Folio) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Card 1: Delivery & Contact */}
        <div className="bg-[#141416] border border-white/[0.08] rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h3 className="font-serif text-xl text-white">
                Delivery & Contact
              </h3>
              <ConciergeBell className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="pt-4 space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-sans">
                  PATRON
                </p>
                <p className="text-sm text-white font-sans mt-0.5 font-medium">
                  {orderDetails.patronName}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-sans">
                    PHONE
                  </p>
                  <p className="text-xs text-neutral-300 font-sans mt-0.5">
                    {orderDetails.phone}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-sans">
                    EMAIL
                  </p>
                  <p className="text-xs text-neutral-300 font-sans mt-0.5">
                    {orderDetails.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-sans">
                  DESTINATION ADDRESS
                </p>
                <p className="text-xs text-neutral-300 font-sans mt-0.5">
                  {orderDetails.address}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-sans">
                  SERVICE COURIER
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-[1px] bg-[#e66200]" />
                  <span className="text-xs text-neutral-300 font-sans">
                    {orderDetails.courier}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Insulated Earthenware Note */}
          <div className="bg-[#1b1a1f] border border-white/[0.06] rounded-xl p-3.5 flex items-start gap-3">
            <Lock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Hand delivered in insulated thermal earthenware casing to preserve hearth embers and aroma.
            </p>
          </div>
        </div>

        {/* Card 2: Payment & Folio Summary */}
        <div className="bg-[#141416] border border-white/[0.08] rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h3 className="font-serif text-xl text-white">
                Payment & Folio Summary
              </h3>
              <FileText className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="pt-4 space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center text-neutral-400">
                <span>Items Subtotal</span>
                <span className="text-white font-medium">{orderDetails.subtotal}</span>
              </div>

              <div className="flex justify-between items-center text-neutral-400">
                <span>Delivery Courier</span>
                <span className="text-[#e66200] font-semibold tracking-wider uppercase">
                  {orderDetails.deliveryFee}
                </span>
              </div>

              <div className="flex justify-between items-center text-neutral-400">
                <span>Taxes & Service Charge</span>
                <span className="text-white">{orderDetails.tax}</span>
              </div>
            </div>

            {/* Total Settled Banner */}
            <div className="mt-6 bg-[#1a191e] border border-white/[0.08] rounded-xl p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-neutral-300 tracking-wider uppercase font-sans">
                  TOTAL SETTLED
                </p>
                <p className="text-[11px] text-neutral-500 font-sans mt-0.5">
                  Currency: LKR
                </p>
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-medium text-[#e66200] tracking-wide">
                {orderDetails.totalSettled}
              </div>
            </div>
          </div>

          {/* Card Verified Footer */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-2 text-neutral-300">
              <CreditCard className="w-4 h-4 text-neutral-400" />
              <span>Paid via Visa ending in • • • • {orderDetails.cardLast4}</span>
            </div>
            <span className="text-emerald-400 font-semibold text-[11px] tracking-wider uppercase">
              VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* ─── Bottom Actions ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#18181c] border border-white/10 text-xs font-semibold text-white tracking-wider uppercase hover:border-[#e66200] hover:text-[#e66200] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO MY ORDERS</span>
        </button>

        <button
          onClick={handleReorder}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#e66200] text-white text-xs font-semibold tracking-wider uppercase hover:bg-orange-600 transition-colors shadow-lg cursor-pointer"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>REORDER DISHES</span>
        </button>
      </div>
    </div>
  );
}
