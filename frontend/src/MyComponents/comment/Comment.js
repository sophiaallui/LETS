import React from 'react';
import { Media } from 'reactstrap';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import './commentDesign.css';
const Comment = ({ comment }) => {
	console.log(comment);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	return (
		<Media className='container'>
			<Media className='media-comment'>
				<Link to={`/profile/${comment.postedBy}`}>
					<div className='comment-user-image-container'>
						<img
							alt='...'
							src={
								comment.commentorProfileImage
									? PF + comment.commentorProfileImage
									: require('assets/img/placeholder.jpg')
							}
						/>
					</div>
				</Link>
			</Media>

			<Media body>
				<Media heading>
                    {comment.postedBy}
                </Media>
                <Media>
                {comment.content}
                </Media>
				
				{format(comment.createdAt)}
			</Media>
		</Media>
	);
};

export default Comment;
