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
    description: '?????? ????????? ????????? ?????? ???????????? ????????? ??? ???????????????.',
  },
  unauthorized: {
    token: {
      description: '????????? ???????????? ?????? ??? ???????????????.',
    },
    password: {
      description: '??????????????? ???????????? ?????? ??? ???????????????.',
    },
    tokenAndPwd: {
      description:
        '????????? ???????????? ????????? ??????????????? ???????????? ?????? ??? ???????????????.',
    },
  },
  forbidden: {
    mail: {
      description:
        '?????? ????????? ?????? ????????? ???????????? ?????? ????????? ?????? ???????????????.',
    },
    admin: {
      description: '????????? ????????? ?????? ?????? ???????????????.',
    },
  },
  notFound: {
    user: {
      description: '????????????????????? ???????????? ????????? ?????? ??? ???????????????.',
    },
    detail: {
      description: '????????? ???????????? ???????????? ?????? ?????? ???????????????.',
    },
    dailys: {
      description: '????????? ????????? ????????? ?????? ?????? ???????????????.',
    },
    daily: {
      description: '?????? ????????? ????????? ????????? ?????? ?????? ???????????????.',
    },
    dailyOrDietId: {
      description:
        '?????? ????????? ????????? ????????? ????????? ?????? ????????? diet_id??? ?????? ?????? ???????????????.',
    },
    dailyOrExerciseId: {
      description:
        '?????? ????????? ????????? ????????? ????????? ?????? ????????? exercise_id??? ?????? ?????? ???????????????.',
    },
    exercise: {
      description:
        '??????????????? ????????? ?????????, ????????? ???????????? ??????????????? ?????? ?????? ???????????????.',
    },
  },
  conflict: {
    e_mail: {
      description: '?????? ???????????? ?????? ???????????? ?????? ???????????????.',
    },
    detail: {
      description: '?????? ????????? ???????????? ?????? ?????? ???????????????.',
    },
    exercise: {
      description: '?????? ???????????? ????????? ?????? ???????????????.',
    },
  },
};
