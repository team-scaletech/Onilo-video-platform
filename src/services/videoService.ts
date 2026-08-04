import { MOCK_VIDEOS } from '../constants';
import { ApiResponse, VideoMetadata } from '../types';
import { apiClient } from './apiClient';

const isMock = import.meta.env.VITE_ENABLE_MOCK_API !== 'false';

export const videoService = {
  async getVideos(): Promise<ApiResponse<VideoMetadata[]>> {
    if (isMock) {
      return { success: true, data: MOCK_VIDEOS };
    }
    return apiClient.get('/videos');
  },

  async getVideoById(id: string): Promise<ApiResponse<VideoMetadata>> {
    if (isMock) {
      const found = MOCK_VIDEOS.find((v) => v.id === id) || MOCK_VIDEOS[0];
      return { success: true, data: found };
    }
    return apiClient.get(`/videos/${id}`);
  },

  async recordQuizResult(videoId: string, quizId: string, isCorrect: boolean, score: number) {
    if (isMock) {
      console.log(`[Mock Analytics] Recorded quiz ${quizId} result for video ${videoId}: ${isCorrect ? 'Correct' : 'Incorrect'}, score: ${score}`);
      return { success: true, message: 'Quiz result recorded' };
    }
    return apiClient.post(`/videos/${videoId}/quiz-result`, { quizId, isCorrect, score });
  },
};
