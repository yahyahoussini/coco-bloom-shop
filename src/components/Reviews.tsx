import type { Product } from "@/types/models";
import StarRating from "./StarRating";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Props {
  reviews: Product['reviews'];
  qna: Product['qna'];
}

const Reviews = ({ reviews, qna }: Props) => {
  if (!reviews && !qna) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-center">From The Community</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Reviews Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Customer Reviews</h3>
          {reviews ? (
            <div className="space-y-4">
              {reviews.items.map(review => (
                <Card key={review.id}>
                  <CardContent className="p-4 flex gap-4">
                    <Avatar>
                      <AvatarImage src={review.photo} alt={review.author} />
                      <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{review.author}</p>
                        <StarRating rating={review.rating} size={16} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="w-full">Write a review</Button>
            </div>
          ) : <p>No reviews yet.</p>}
        </div>

        {/* Q&A Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Questions & Answers</h3>
          {qna ? (
            <div className="space-y-4">
              {qna.items.map(item => (
                <div key={item.id} className="text-sm">
                  <p className="font-semibold">Q: {item.question}</p>
                  <p className="text-muted-foreground">A: {item.answer}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full">Ask a question</Button>
            </div>
          ) : <p>No questions yet.</p>}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
