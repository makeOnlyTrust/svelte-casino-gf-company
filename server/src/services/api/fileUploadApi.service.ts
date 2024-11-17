import axios from "axios";
import FormData from "form-data";

const STORAGE_SERVER_URL = 'https://storage.goodfriendszone.com';

export const fileUpload = async (formData: FormData) => {
	const endpoint = `${STORAGE_SERVER_URL}/logo-upload`;

	return new Promise((resolve, reject) => {
		axios
			.post(endpoint, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
}