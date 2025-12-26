/**
 * 회원가입 폼 Zod 스키마
 */
import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  nickname: z
    .string()
    .min(1, '닉네임을 입력해주세요')
    .max(20, '닉네임은 최대 20자까지 입력 가능합니다'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

