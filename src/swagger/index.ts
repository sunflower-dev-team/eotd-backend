import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Daily, Dailys } from 'src/schemas/daily.schema';
import { Exercise } from 'src/schemas/exercise.schema';
import { KakaoSigninFailure } from 'src/oauth/interfaces/kakao-signin-failure.interface';
import { UserDetail } from 'src/schemas/user-detail.schema';
import { UserInfo } from 'src/user/interfaces/user-info.interface';

class SuccessResponseDataNull {
  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty({ example: null })
  data: 'null';
}

class BasicUserData extends OmitType(UserInfo, ['kakao_id'] as const) {}
class KakaoUserData extends OmitType(UserInfo, ['e_mail'] as const) {}

class SuccessResponseBasicUserData {
  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty()
  data: BasicUserData;
}

class SuccessResponseKakaoUserData {
  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty()
  data: KakaoUserData;
}

class SuccessResponseDataUserDetail {
  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty()
  data: UserDetail;
}

class SuccessResponseDataDailys {
  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty({ type: Dailys })
  data: Dailys;
}

class SuccessResponseDataDaily {
  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty({ type: Daily })
  data: Daily;
}

class SuccessResponseDataExercise {
  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty({ type: Exercise })
  data: Exercise;
}

class SuccessResponseDataExercises {
  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty({ type: [Exercise] })
  data: Exercise[];
}

class FailureResponseDataKakaoSignin {
  @ApiProperty({ example: 'failure' })
  message: string;

  @ApiProperty({ type: KakaoSigninFailure })
  data: KakaoSigninFailure;
}

export const api = {
  success: {
    nulldata: {
      description: 'success',
      type: SuccessResponseDataNull,
    },
    basicUser: {
      description: 'success',
      type: SuccessResponseBasicUserData,
    },
    kakaoUser: {
      description: 'success',
      type: SuccessResponseKakaoUserData,
    },
    userDetail: {
      description: 'success',
      type: SuccessResponseDataUserDetail,
    },
    dailys: {
      description: 'success',
      type: SuccessResponseDataDailys,
    },
    daily: {
      description: 'success',
      type: SuccessResponseDataDaily,
    },
    exercise: {
      description: 'success',
      type: SuccessResponseDataExercise,
    },
    exercises: {
      description: 'success',
      type: SuccessResponseDataExercises,
    },
  },
  failure: {
    oauth: {
      kakao: {
        description: 'failure',
        type: FailureResponseDataKakaoSignin,
      },
    },
  },
  badRequest: {
    description: '필수 속성이 없거나 없는 속성으로 요청할 때 응답합니다.',
  },
  unauthorized: {
    token: {
      description: '토큰이 유효하지 않을 때 응답합니다.',
    },
    password: {
      description: '비밀번호가 일치하지 않을 때 응답합니다.',
    },
    tokenAndPwd: {
      description:
        '토큰이 유효하지 않거나 비밀번호가 일치하지 않을 때 응답합니다.',
    },
  },
  forbidden: {
    mail: {
      description:
        '해당 유저가 메일 인증을 완료하지 않고 접근할 경우 응답합니다.',
    },
    admin: {
      description: '관리자 권한이 없을 경우 응답합니다.',
    },
  },
  notFound: {
    user: {
      description: '데이터베이스에 찾으려는 유저가 없을 때 응답합니다.',
    },
    detail: {
      description: '유저의 디테일이 존재하지 않는 경우 응답합니다.',
    },
    dailys: {
      description: '어떠한 데일리 기록도 없는 경우 응답합니다.',
    },
    daily: {
      description: '해당 날짜의 데일리 기록이 없는 경우 응답합니다.',
    },
    dailyOrDietId: {
      description:
        '해당 날짜의 데일리 기록이 없거나 해당 날짜의 diet_id가 없는 경우 응답합니다.',
    },
    dailyOrExerciseId: {
      description:
        '해당 날짜의 데일리 기록이 없거나 해당 날짜의 exercise_id가 없는 경우 응답합니다.',
    },
    exercise: {
      description:
        '운동정보가 하나도 없거나, 조건에 부합하는 운동정보가 없는 경우 응답합니다.',
    },
  },
  conflict: {
    e_mail: {
      description: '이미 사용되고 있는 이메일인 경우 응답합니다.',
    },
    detail: {
      description: '이미 유저의 디테일이 있는 경우 응답합니다.',
    },
    exercise: {
      description: '이미 존재하는 운동인 경우 응답합니다.',
    },
  },
};
