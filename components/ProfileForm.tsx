"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/profile/actions";
import {
  User,
  MapPin,
  Phone,
  FileText,
  Building2,
  Bell,
  Loader2,
  Check,
} from "lucide-react";

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string;
    phone: string | null;
    documentType: string | null;
    documentNumber: string | null;
    businessName: string | null;
    taxId: string | null;
    contactPreference: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    country: string | null;
    image: string | null;
    createdAt: Date | string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    phone: user.phone || "",
    documentType: user.documentType || "DNI",
    documentNumber: user.documentNumber || "",
    businessName: user.businessName || "",
    taxId: user.taxId || "",
    contactPreference: user.contactPreference || "email",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    zipCode: user.zipCode || "",
    country: user.country || "Perú",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validación: Si hay tipo de documento, debe haber número
    if (
      formData.documentType &&
      formData.documentType !== "DNI" &&
      !formData.documentNumber
    ) {
      setMessage({
        type: "error",
        text: "Debes ingresar el número de documento si seleccionaste un tipo",
      });
      return;
    }

    // Validación: Si hay Razón Social, debe haber RUC
    if (formData.businessName && !formData.taxId) {
      setMessage({
        type: "error",
        text: "Debes ingresar el RUC si especificaste una Razón Social",
      });
      return;
    }

    // Validación: Si hay RUC, debe haber Razón Social
    if (formData.taxId && !formData.businessName) {
      setMessage({
        type: "error",
        text: "Debes ingresar la Razón Social si especificaste un RUC",
      });
      return;
    }

    startTransition(async () => {
      const result = await updateProfile(formData);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else if (result.success) {
        setMessage({ type: "success", text: result.success });
        setTimeout(() => setMessage(null), 3000);
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Personal */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-electric-600 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <User size={20} />
            <h2 className="text-lg font-bold">Información Personal</h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Email (Read-only) */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              title="Tu correo electrónico registrado"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">
              El correo no se puede cambiar
            </p>
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Nombre de Usuario *
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
              placeholder="tu_username"
            />
            <p className="text-xs text-slate-500 mt-1">
              Este es tu identificador único
            </p>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Nombre Completo
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
              placeholder="Juan Pérez"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"
            >
              <Phone size={16} />
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
              placeholder="+51 999 999 999"
            />
          </div>
        </div>
      </div>

      {/* Documentos de Identidad */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-electric-600 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <FileText size={20} />
            <h2 className="text-lg font-bold">Documentos de Identidad</h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Document Type & Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="documentType"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Tipo de Documento
              </label>
              <select
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                title="Selecciona tu tipo de documento"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
              >
                <option value="DNI">DNI</option>
                <option value="Cédula">Cédula</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="RUC">RUC</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="documentNumber"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Número de Documento
              </label>
              <input
                id="documentNumber"
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
                placeholder="12345678"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Datos Fiscales (Empresas) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-electric-600 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <Building2 size={20} />
            <h2 className="text-lg font-bold">Datos Fiscales (Opcional)</h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-600">
            Completa esta sección si necesitas factura a nombre de tu empresa
          </p>

          {/* Business Name */}
          <div>
            <label
              htmlFor="businessName"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Razón Social
            </label>
            <input
              id="businessName"
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
              placeholder="Mi Empresa S.A.C."
            />
          </div>

          {/* Tax ID (RUC) */}
          <div>
            <label
              htmlFor="taxId"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              RUC
            </label>
            <input
              id="taxId"
              type="text"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
              placeholder="20123456789"
            />
          </div>
        </div>
      </div>

      {/* Preferencias */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-electric-600 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <Bell size={20} />
            <h2 className="text-lg font-bold">Preferencias de Contacto</h2>
          </div>
        </div>

        <div className="p-6">
          <label
            htmlFor="contactPreference"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            ¿Cómo prefieres recibir notificaciones?
          </label>
          <select
            id="contactPreference"
            name="contactPreference"
            value={formData.contactPreference}
            onChange={handleChange}
            title="Selecciona tu preferencia de contacto"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
          >
            <option value="email">Solo Email</option>
            <option value="whatsapp">Solo WhatsApp</option>
            <option value="both">Email y WhatsApp</option>
          </select>
          <p className="text-xs text-slate-500 mt-2">
            Para WhatsApp, asegúrate de tener tu teléfono actualizado
          </p>
        </div>
      </div>

      {/* Dirección */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-electric-600 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <MapPin size={20} />
            <h2 className="text-lg font-bold">Dirección de Envío</h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Dirección
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
              placeholder="Av. Principal 123, Distrito"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Ciudad
              </label>
              <input
                id="city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
                placeholder="Lima"
              />
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Departamento/Región
              </label>
              <input
                id="state"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
                placeholder="Lima"
              />
            </div>
          </div>

          {/* Zip Code & Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Código Postal
              </label>
              <input
                id="zipCode"
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
                placeholder="15001"
              />
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                País
              </label>
              <input
                id="country"
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
                placeholder="Perú"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" && <Check size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 bg-gradient-to-r from-electric-600 to-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </button>
      </div>

      {/* Member Since */}
      <div className="text-center text-sm text-slate-500">
        Miembro desde{" "}
        {new Date(user.createdAt).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </form>
  );
}
