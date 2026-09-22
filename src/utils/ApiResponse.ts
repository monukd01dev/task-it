export class ApiResponse {
    static success(message: string = 'Request successful', data: any = null) {
        return {
            success: true,
            message,
            data,
            error: null,
        }
    }
}