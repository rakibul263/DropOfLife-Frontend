'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, DonorReview } from '@/types';
import { Star, MessageSquareHeart, CheckCircle2, ShieldCheck, Heart, User as UserIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/stores/toastStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/lib/utils';

interface DonorReviewModalProps {
  donor: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DonorReviewModal({ donor, isOpen, onClose }: DonorReviewModalProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewerContact, setReviewerContact] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const donorId = donor?._id || donor?.id;

  // Fetch reviews for this donor
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['donor-reviews', donorId],
    queryFn: async () => {
      if (!donorId) return [];
      const res = await api.get(`/donors/${donorId}/reviews`);
      return res.data.data.reviews as DonorReview[];
    },
    enabled: !!donorId && isOpen,
  });

  const reviews = reviewsData || [];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorId) return;

    if (!reviewerName.trim() || !comment.trim()) {
      toast.warning('অনুগ্রহ করে আপনার নাম এবং মতামত লিখুন।', 'তথ্য অসম্পূর্ণ');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/donors/${donorId}/reviews`, {
        reviewerName: reviewerName.trim(),
        reviewerContact: reviewerContact.trim(),
        rating,
        comment: comment.trim(),
      });

      toast.success(
        'রক্তদাতার প্রতি আপনার মূল্যবান রিভিউ ও কৃতজ্ঞতা সফলভাবে যুক্ত হয়েছে!',
        'ধন্যবাদ'
      );
      setComment('');
      setReviewerName('');
      setReviewerContact('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['donor-reviews', donorId] });
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    } catch (err: any) {
      toast.error(err.message || 'রিভিউ জমা দেওয়া সম্ভব হয়নি।');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!donor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl bg-zinc-950/95 border border-white/20 p-6 sm:p-7 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(225,29,72,0.2)] backdrop-blur-3xl text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
              রক্তগ্রহীতাদের অভিজ্ঞতা ও মূল্যায়ন
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-white flex items-center justify-between">
            <span>{donor.name} — রিভিউ ও রেটিং</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {donor.bloodGroup} রক্তদাতা
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            এই রক্তদাতার কাছ থেকে রক্ত গ্রহণ করার পর রোগীর অভিজ্ঞতা ও আন্তরিক প্রতিক্রিয়া
          </DialogDescription>
        </DialogHeader>

        {/* Reviews List Section */}
        <div className="space-y-3 py-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
            <span className="flex items-center gap-1.5">
              <MessageSquareHeart className="w-4 h-4 text-rose-400" />
              <span>পূর্ববর্তী রিভিউসমূহ ({reviews.length})</span>
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>গড় রেটিং: {donor.rating || 5.0} / 5.0</span>
            </span>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {isLoading ? (
              <p className="text-xs text-zinc-500 text-center py-4">রিভিউ লোড হচ্ছে...</p>
            ) : reviews.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center text-xs text-zinc-400 space-y-1">
                <p>এখনো কোনো লিখিত রিভিউ নেই।</p>
                <p className="text-[11px] text-zinc-500">
                  আপনি এই রক্তদাতার কাছ থেকে রক্ত পেয়ে থাকলে প্রথম রিভিউটি দিন!
                </p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-bold">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white">{rev.reviewerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed pl-8">
                    "{rev.comment}"
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono block pl-8">
                    {formatDate(rev.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit New Review Form */}
        <form
          onSubmit={handleSubmitReview}
          className="border-t border-white/10 pt-4 space-y-3.5 bg-white/[0.02] p-4 rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>আপনার অভিজ্ঞতা ও রেটিং লিখুন</span>
            </h4>

            {/* Star Rating Picker */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-zinc-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              required
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="আপনার নাম (রোগী বা স্বজন) *"
              className="bg-zinc-900/90 border-white/15 text-white h-10 text-xs rounded-xl"
            />
            <Input
              value={reviewerContact}
              onChange={(e) => setReviewerContact(e.target.value)}
              placeholder="যোগাযোগ ফোন (ঐচ্ছিক)"
              className="bg-zinc-900/90 border-white/15 text-white h-10 text-xs rounded-xl"
            />
          </div>

          <textarea
            required
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="রক্তদাতার সহযোগিতা, সময়নিষ্ঠতা ও ব্যবহার সম্পর্কে সংক্ষেপে লিখুন... *"
            className="w-full p-3 rounded-xl bg-zinc-900/90 border border-white/15 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 resize-none"
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs h-10 shadow-lg shadow-rose-950/50 rounded-xl cursor-pointer"
          >
            {isSubmitting ? 'রিভিউ জমা হচ্ছে...' : 'রিভিউ ও রেটিং পোস্ট করুন'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
