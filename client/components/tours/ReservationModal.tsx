import { useMemo, useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CreditCard, MapPin, ShieldCheck, CheckCircle2, Users, User } from "lucide-react";
import type { Tour } from "./data";

function formatEUR(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export type ReservationModalProps = {
  tour: Tour;
  defaultDate?: string;
};

export default function ReservationModal({ tour, defaultDate }: ReservationModalProps) {
  const [step, setStep] = useState<"select" | "details" | "payment" | "success">("select");

  const [date, setDate] = useState<string>(defaultDate || "");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [departure, setDeparture] = useState("Antalya");
  const [gender, setGender] = useState("female");

  const totalPeople = adults + children + babies;
  const priceablePeople = adults + children; // bebek ücretsiz varsayalım
  const totalPrice = useMemo(() => priceablePeople * tour.priceEUR, [priceablePeople, tour.priceEUR]);

  // Payment states
  const [method, setMethod] = useState<"card" | "pre">("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [pre1, setPre1] = useState(false);
  const [pre2, setPre2] = useState(false);
  const [pre3, setPre3] = useState(false);

  const [reservationCode, setReservationCode] = useState<string | null>(null);

  function genCode(len = 8) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  return (
    <DialogContent className="max-w-5xl w-[95vw]">
      <DialogHeader>
        <DialogTitle>
          {step === "select" && "Rezervasyon"}
          {step === "details" && "Yolcu Bilgileri"}
          {step === "payment" && "Ödeme Bilgileri"}
          {step === "success" && "Rezervasyonunuz Onaylanmıştır"}
        </DialogTitle>
      </DialogHeader>

      {step === "select" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-600 mb-1">Tarih ve Saat</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Yetişkin</label>
            <input
              type="number"
              min={1}
              value={adults}
              onChange={(e) => setAdults(Math.max(1, Number(e.target.value || 1)))}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Çocuk</label>
            <input
              type="number"
              min={0}
              value={children}
              onChange={(e) => setChildren(Math.max(0, Number(e.target.value || 0)))}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Bebek</label>
            <input
              type="number"
              min={0}
              value={babies}
              onChange={(e) => setBabies(Math.max(0, Number(e.target.value || 0)))}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-3">
            <p className="text-sm font-medium mb-2">Ekstralar</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="flex items-center gap-2">
                <Checkbox /> Öğle Yemeği
              </label>
              <label className="flex items-center gap-2">
                <Checkbox /> Fotoğraf/Video
              </label>
              <label className="flex items-center gap-2">
                <Checkbox /> Otel Transfer
              </label>
              <label className="flex items-center gap-2">
                <Checkbox /> Dalış Ekipmanı
              </label>
            </div>
          </div>

          <div className="md:col-span-3 flex items-center justify-between pt-2">
            <div className="text-sm text-slate-600">
              Toplam Kişi: <b>{totalPeople}</b> • Kişi başı: <b>{formatEUR(tour.priceEUR)}</b> • Tahmini Toplam: <b>{formatEUR(totalPrice)}</b>
            </div>
            <button
              className="rounded-md bg-brand text-white px-4 py-2 font-semibold"
              onClick={() => setStep("details")}
            >
              Rezervasyona Devam Et
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            <div className="rounded-md border p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div>Rezervasyon Tarihi: <b>{date ? new Date(date).toLocaleString("tr-TR") : "—"}</b></div>
                  <div>Kişiler: <b>{adults}</b> yetişkin, <b>{children}</b> çocuk, <b>{babies}</b> bebek</div>
                </div>
                <button
                  className="text-brand text-sm font-semibold underline underline-offset-2"
                  onClick={() => setStep("select")}
                >
                  Düzenle
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Ad*</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Soyad*</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Telefon Numarası*</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">E-posta Adresi*</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Oda Numarası</label>
                <input
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Kalkış Yeri</label>
                <Select value={departure} onValueChange={setDeparture}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Antalya">Antalya</SelectItem>
                    <SelectItem value="Kemer">Kemer</SelectItem>
                    <SelectItem value="Belek">Belek</SelectItem>
                    <SelectItem value="Side">Side</SelectItem>
                    <SelectItem value="Alanya">Alanya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-600 mb-1">Cinsiyet</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroup value={gender} onValueChange={setGender} className="grid grid-flow-col gap-6">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="f" value="female" />
                        <label htmlFor="f">Kadın</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="m" value="male" />
                        <label htmlFor="m">Erkek</label>
                      </div>
                    </RadioGroup>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="rounded-md bg-brand text-white px-4 py-2 font-semibold"
                onClick={() => {
                  // final submit simulation
                  alert("Rezervasyon talebiniz alındı.\n\n" +
                    `Ad Soyad: ${firstName} ${lastName}\n` +
                    `Telefon: ${phone}\n` +
                    `E-posta: ${email}\n` +
                    `Kalkış Yeri: ${departure}\n` +
                    `Toplam: ${formatEUR(totalPrice)}\n`);
                }}
              >
                Güvenli Ödeme İçin Devam Et
              </button>
            </div>
          </div>

          <aside className="rounded-lg border p-4 bg-card/50">
            <h3 className="font-semibold mb-3">Tur Özeti</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-600">Tur</dt><dd className="font-medium text-right">{tour.title}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600">Kişi Sayısı</dt><dd className="font-medium">{totalPeople}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600">Rezervasyon Sahibi</dt><dd className="font-medium text-right">{(firstName + " " + lastName).trim() || "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600">Kalkış Yeri</dt><dd className="font-medium">{departure}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600">Kişi Başı</dt><dd className="font-medium">{formatEUR(tour.priceEUR)}</dd></div>
            </dl>
            <div className="border-t mt-3 pt-3 flex justify-between text-sm">
              <span className="font-semibold">Toplam</span>
              <span className="font-extrabold">{formatEUR(totalPrice)}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Bebekler için ücret alınmaz.</p>
          </aside>
        </div>
      )}
    </DialogContent>
  );
}
