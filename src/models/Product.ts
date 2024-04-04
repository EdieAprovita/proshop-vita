import { Schema, Document, model } from "mongoose";

import { IReview } from "./Review";

export interface IProduct extends Document {
	user: Schema.Types.ObjectId;
	name: string;
	image: string;
	brand: string;
	category: string;
	description: string;
	reviews: IReview[];
	rating: number;
	numReviews: number;
	price: number;
	countInStock: number;
	timestamps: {
		createdAt: Date;
		updatedAt: Date;
	};
}

const productSchema = new Schema<IProduct>(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		name: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
		rating: {
			type: Number,
			required: true,
			default: 0,
		},
		numReviews: {
			type: Number,
			required: true,
			default: 0,
		},
		price: {
			type: Number,
			required: true,
			default: 0,
		},
		countInStock: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

export const Product = model<IProduct>("Product", productSchema);
