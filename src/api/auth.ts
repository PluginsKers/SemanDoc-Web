import http from "@/api/http";

export const login = async (username: string, password: string) => {
	const response = await http.post(`/auth/login`, {
		username,
		password,
	});
	return response.data;
};

export const updateUserPassword = async (
	userId: number,
	newPassword: string,
) => {
	try {
		const response = await http.put(`/user/${userId}`, {
			password: newPassword,
		});
		return response.data;
	} catch (error) {
		console.error("Error updating password:", error);
		throw error;
	}
};

export const createUser = async (
	username: string,
	password: string,
	role: number,
	nickname: string = "User",
) => {
	try {
		const response = await http.post(`/user`, {
			username,
			password,
			role,
			nickname,
		});
		return response.data;
	} catch (error) {
		console.error("Error creating user:", error);
		throw error;
	}
};

export const getUser = async () => {
	try {
		const response = await http.get(`/users`);
		return response.data;
	} catch (error) {
		console.error("Error getting user by username:", error);
		throw error;
	}
};
