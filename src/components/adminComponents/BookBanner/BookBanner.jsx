import React, { useState } from 'react';
import {
  FaStar, FaRegStar, FaEye,
  FaTrash, FaEdit,
  FaPaperPlane,
  FaBan,
} from 'react-icons/fa';
import EditBookForm from '../EditBookForm/EditBookForm';
import DeleteBookModal from '../DeleteBookModal/DeleteBookModal';
import PublishBookModal from '../PublishBookModal/PublishBookModal';
import './BookBanner.css';
import { firebaseErrorMap } from '../../../firebase/firebaseErrorMap';
import { toast } from 'react-toastify';
import apiCalls from '../../../utils/api';





const BookBanner = ({ book, onBookUpdate, onDeleted }) => {
	const [showDelete, setShowDelete] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [showPublishModal, setShowPublishModal] = useState(false);

	if (!book) return null;

	const {
		coverImageUrl,
		title,
		tagline,
		genre = [],
		language,
		releaseStatus,
		accessType,
		price,
		ratingAverage,
		ratingCount,
		chapterCount,
		momentCount,
		viewCount,
		isPublished,
		publicationDate,
		id: bookId
	} = book;

	const priceDisplay = accessType === 'Free' ? 'Free' : `₹${Number(price).toFixed(2)}`;

	const renderStars = () => {
		const stars = [];
		for (let i = 1; i <= 5; i += 1) {
			stars.push(
			i <= Math.round(ratingAverage) ? (
				<FaStar key={i} className="inline-block" />
			) : (
				<FaRegStar key={i} className="inline-block" />
			)
			);
		}
		return stars;
	};


	const handleCancelPublish = async () => {
		try {
			await apiCalls.togglePublishBook(book.id, false);
			toast.success("Your book is now hidden from the public.");
			onBookUpdate();
		} catch (error) {
			console.log('error in handleCancelPublish: ', error);
			const message = firebaseErrorMap.get(error?.code) ?? 'Failed to unpublish book. Please try again.';
			toast.error(message);
		}
	};




	return (
		<>
			<div className="book-banner">
				<div className="cover">
					<img
						src={coverImageUrl || '/placeholder-cover.png'}
						alt={title}
					/>
				</div>

				<div className="content">
					<div className="flex justify-between items-start flex-wrap gap-3">
						<div>
						<h1 className="title">{title}</h1>
						{tagline && <p className="tagline">{tagline}</p>}
						</div>

						<div className="flex gap-5">
							{isPublished ? (
								<button
									onClick={handleCancelPublish}  // Directly call Cancel Publish without modal
									className="icon-button unpublish-button"
									title="Cancel Publish">
									<FaBan />
								</button>
							) : (
								<button
									onClick={() => setShowPublishModal(true)}
									className="icon-button publish-button"
									title="Publish Book" >
									<FaPaperPlane />
								</button>
							)}

							<button
								onClick={() => setShowEdit(true)}
								className="icon-button edit-button"
								title="Edit Book" >
								<FaEdit />
							</button>

							<button
								onClick={() => setShowDelete(true)}
								className="icon-button delete-button"
								title="Delete Book" >
								<FaTrash />
							</button>
						</div>
					</div>

					<div className="stats">
						<span className="stat">📚 {chapterCount} chapters / {momentCount} moments</span>
						<span className="stat">{renderStars()} ({ratingCount})</span>
						<span className="stat"><FaEye /> {viewCount.toLocaleString()}</span>
					</div>

					<div className="badges">
						<div className="badge-row">
							<span className="badge-title">Genre </span>
							<span className="badge-value">
								:
								{genre.map((g) => (
									<span key={g} className="badge blue">{g}</span>
								))}
							</span>
						</div>

						<div className="badge-row">
							<span className="badge-title">Language </span>
							<span className="badge-value">
								:
								<span className="badge green">{language}</span>
							</span>
						</div>

						<div className="badge-row">
							<span className="badge-title">Status </span>
							<span className="badge-value">
								:
								<span className="badge purple">{releaseStatus}</span>
							</span>
						</div>

						{isPublished && publicationDate && (
						<div className="badge-row">
							<span className="badge-title">Published On </span>
							<span className="badge-value">
								:
								<span className="badge purple">{publicationDate}</span>
							</span>
						</div>
						)}

						<div className="badge-row">
							<span className="badge-title">Price</span>
							<span className="badge-value">
								:
								<span className="badge yellow"> {priceDisplay}</span>
							</span>
						</div>
					</div>
				</div>
			</div>

			{showEdit && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
						<EditBookForm
						book={book}
						onClose={() => setShowEdit(false)}
						onBookUpdate={onBookUpdate}
						/>
					</div>
				</div>
			)}

			{showDelete && (
				<DeleteBookModal
					bookId={bookId}
					bookTitle={title}
					close={() => setShowDelete(false)}
					onDeleted={onDeleted}
				/>
			)}

			{showPublishModal && (
				<PublishBookModal
					bookId={bookId}
					bookTitle={title}
					existingPublishDate={publicationDate}
					onClose={() => setShowPublishModal(false)}
					onSuccess={onBookUpdate}
				/>
			)}
		</>
	);
};

export default BookBanner;