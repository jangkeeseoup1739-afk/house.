/**
 * 연도 동적 헬퍼 유틸리티
 * 현재 시스템 연도(new Date().getFullYear())를 기준으로 자동으로 계산되어
 * 해가 바뀌면(예: 2026 -> 2027 -> 2028 ...) 별도의 수동 수정 없이도 사이트 전반에 자동 반영됩니다.
 */

export const CURRENT_YEAR = new Date().getFullYear();

/**
 * 텍스트 내에서 현재 연도를 자연스럽게 표현하기 위한 헬퍼들
 */
export const YEAR_STR = `${CURRENT_YEAR}`;
export const YEAR_KOR = `${CURRENT_YEAR}년`;
