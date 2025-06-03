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



const BookBanner = ({ book, onBookUpdate, onDeleted, onTogglePublish }) => {
	const [showDelete, setShowDelete] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [showPublishModal, setShowPublishModal] = useState(false);

	if (!book) return null; // Guard against undefined

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
	} = book;

	const priceDisplay = accessType === 'Free' ? 'Free' : `₹${Number(price).toFixed(2)}`;

	// Helper: render five stars with half-step accuracy
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

	const handlePublish = (publishDate) => {
		onTogglePublish(true, publishDate); // Pass publishDate to parent
	};




	return (
		<>
			{/* Book Banner */}
			<div className="book-banner">
				{/* Cover image */}
				<div className="cover">
					<img
						src={coverImageUrl || '/placeholder-cover.png'}
						alt={title}
					/>
				</div>

				{/* Content */}
				<div className="content">
					{/* Top row */}
					<div className="flex justify-between items-start flex-wrap gap-3">
						<div>
							<h1 className="title">{title}</h1>
							{tagline && <p className="tagline">{tagline}</p>}
						</div>

						{/* Action icons */}
						<div className="flex gap-5">
							{/* Publish / unpublish */}
							{isPublished ? (
								<button
									onClick={() => onTogglePublish(false)}
									className="icon-button unpublish-button"
									title="Cancel Publish" >
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

							{/* Edit */}
							<button
								onClick={() => setShowEdit(true)}
								className="icon-button edit-button"
								title="Edit Book" >
								<FaEdit />
							</button>

							{/* Delete */}
							<button
								onClick={() => setShowDelete(true)}
								className="icon-button delete-button"
								title="Delete Book" >
								<FaTrash />
							</button>
						</div>
					</div>

					{/* Stats */}
					<div className="stats">
						<span className="stat">📚 {chapterCount} chapters / {momentCount} moments</span>
						<span className="stat">{renderStars()} ({ratingCount})</span>
						<span className="stat"><FaEye /> {viewCount.toLocaleString()}</span>
					</div>

					{/* Badges */}
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



			{/* Show Edit book form modal */}
			{showEdit && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
						<EditBookForm
						book={book}
						onClose={() => setShowEdit(false)}
						onBookUpdate={onBookUpdate} // Pass callback to refresh book data
						/>
					</div>
				</div>
			)}

			{/* Show Delete book confirmation / password modal */}
			{showDelete && (
				<DeleteBookModal
					bookId={book.id}
					bookTitle={book.title}
					close={() => setShowDelete(false)}
					onDeleted={onDeleted}
				/>
			)}

			{/* Show publish book date modal */}
			{showPublishModal && (
				<PublishBookModal
					bookTitle={title}
					existingPublishDate={publicationDate}
					onClose={() => setShowPublishModal(false)}
					onPublish={handlePublish}
				/>
			)}
		</>
	);
};

export default BookBanner;