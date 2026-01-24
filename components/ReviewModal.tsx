"use client";

import { useState, useEffect } from "react";
import { Star, X, User as UserIcon, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

import { createPortal } from "react-dom";

export default function ReviewModal({
  isOpen,
  onClose,
  productId,
  productName,
}: Props) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && productId) {
      setLoading(true);
      fetch(`/api/reviews?productId=${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setReviews(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, productId]);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (res.ok) {
        const newReview = await res.json();
        // Optimistic update of sorts, ideally we fetch the user info correctly but for now:
        const reviewWithUser = {
          ...newReview,
          user: {
            name: session?.user?.name || "Yo",
            image: session?.user?.image,
          },
        };
        setReviews([reviewWithUser, ...reviews]);
        setComment("");
        setRating(0);
        router.refresh(); // Refresh server components if needed
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800">Reseñas</h3>
                <p className="text-xs text-slate-500 truncate max-w-[250px]">
                  {productName}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition"
                type="button"
                aria-label="Close modal"
              >
                <X size={18} className="text-slate-500 cursor-pointer" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Formulario de Reseña */}
              {session ? (
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
                  <p className="text-sm font-semibold text-blue-900">
                    Escribe tu opinión
                  </p>
                  <div className="flex gap-1" onMouseLeave={() => {}}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition hover:scale-110 cursor-pointer"
                        aria-label={`Rate ${star} stars`}
                        type="button"
                      >
                        <Star
                          size={24}
                          className={`${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="¿Qué te pareció este componente?"
                    className="w-full text-sm p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none min-h-[80px] max-h-[150px] bg-white resize-y"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || rating === 0}
                      className="bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {submitting ? (
                        "Enviando..."
                      ) : (
                        <>
                          Enviar <Send size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-500">
                    Inicia sesión para dejar una reseña.
                  </p>
                </div>
              )}

              {/* Lista de Reseñas */}
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4 text-slate-400 text-sm">
                    Cargando opiniones...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    Sé el primero en opinar sobre este producto.
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-slate-100 last:border-0 pb-4"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                            {review.user.image ? (
                              <img
                                src={review.user.image}
                                alt={review.user.name || "U"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserIcon size={16} className="text-slate-400" />
                            )}
                          </div>
                          <div className="text-xs">
                            <p className="font-bold text-slate-700">
                              {review.user.name || "Usuario"}
                            </p>
                            <p className="text-slate-400 text-[10px]">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < review.rating
                                  ? "fill-current"
                                  : "text-slate-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-slate-600 pl-10">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
