declare namespace API {
  type LongLike = number | string;

  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseCampusUser = {
    code?: number;
    data?: CampusUser;
    message?: string;
  };

  type BaseResponseChatHistoryCursorResponse = {
    code?: number;
    data?: ChatHistoryCursorResponse;
    message?: string;
  };

  type BaseResponseChatSessionVO = {
    code?: number;
    data?: ChatSessionVO;
    message?: string;
  };

  type BaseResponseLoginUserVO = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong = {
    code?: number;
    data?: LongLike;
    message?: string;
  };

  type BaseResponsePageChatHistoryVO = {
    code?: number;
    data?: PageChatHistoryVO;
    message?: string;
  };

  type BaseResponsePageChatSessionVO = {
    code?: number;
    data?: PageChatSessionVO;
    message?: string;
  };

  type BaseResponsePageUserVO = {
    code?: number;
    data?: PageUserVO;
    message?: string;
  };

  type BaseResponseString = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUserVO = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type CampusUser = {
    id?: LongLike;
    studentNo?: string;
    passwordHash?: string;
    realName?: string;
    gender?: string;
    avatarUrl?: string;
    major?: string;
    college?: string;
    gradeYear?: number;
    phone?: string;
    email?: string;
    userRole?: string;
    editTime?: string;
    createTime?: string;
    updateTime?: string;
    isDelete?: string;
  };

  type ChatHistoryCursorRequest = {
    sessionId?: LongLike;
    cursorId?: LongLike;
    cursorTime?: string;
    pageSize?: number;
  };

  type ChatHistoryCursorResponse = {
    records?: ChatHistoryVO[];
    nextCursorId?: LongLike;
    nextCursorTime?: string;
    hasMore?: boolean;
  };

  type ChatHistoryQueryRequest = {
    pageNum?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    id?: LongLike;
    sessionId?: LongLike;
    userId?: LongLike;
    messageType?: string;
    startTime?: string;
    endTime?: string;
  };

  type ChatHistoryVO = {
    id?: LongLike;
    sessionId?: LongLike;
    userId?: LongLike;
    messageType?: string;
    message?: string;
    rawMessage?: string;
    parentId?: LongLike;
    createTime?: string;
  };

  type ChatMemoryRequest = {
    sessionId?: LongLike;
    message?: string;
  };

  type chatParams = {
    message: string;
  };

  type ChatSessionAddRequest = {
    title?: string;
    initPrompt?: string;
  };

  type ChatSessionQueryRequest = {
    pageNum?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    id?: LongLike;
    title?: string;
    userId?: LongLike;
  };

  type ChatSessionUpdateRequest = {
    id?: LongLike;
    title?: string;
  };

  type ChatSessionVO = {
    id?: LongLike;
    title?: string;
    userId?: LongLike;
    editTime?: string;
    createTime?: string;
    updateTime?: string;
  };

  type PageRequest = {
    pageNum?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type chatWithSseParams = {
    message: string;
  };

  type DeleteRequest = {
    id?: LongLike;
  };

  type getUserByIdParams = {
    id: LongLike;
  };

  type getUserVOByIdParams = {
    id: LongLike;
  };

  type LoginUserVO = {
    id?: LongLike;
    studentNo?: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    major?: string;
    college?: string;
    gradeYear?: number;
    phone?: string;
    email?: string;
    userRole?: string;
    createTime?: string;
    updateTime?: string;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type PageChatHistoryVO = {
    records?: ChatHistoryVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageChatHistoryVO;
    searchCount?: PageChatHistoryVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageChatSessionVO = {
    records?: ChatSessionVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageChatSessionVO;
    searchCount?: PageChatSessionVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageUserVO = {
    records?: UserVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageUserVO;
    searchCount?: PageUserVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type ServerSentEventString = true;

  type UserAddRequest = {
    studentNo?: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole?: string;
    major?: string;
    college?: string;
    gradeYear?: number;
    phone?: string;
    email?: string;
  };

  type UserLoginRequest = {
    studentNo?: string;
    userPassword?: string;
  };

  type UserPasswordUpdateRequest = {
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };

  type UserQueryRequest = {
    pageNum?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    id?: LongLike;
    studentNo?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
    major?: string;
    college?: string;
    gradeYear?: number;
    phone?: string;
    email?: string;
  };

  type UserRegisterRequest = {
    studentNo?: string;
    userPassword?: string;
    checkPassword?: string;
  };

  type UserUpdateRequest = {
    id?: LongLike;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole?: string;
    major?: string;
    college?: string;
    gradeYear?: number;
    phone?: string;
    email?: string;
  };

  type UserVO = {
    id?: LongLike;
    studentNo?: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    major?: string;
    college?: string;
    gradeYear?: number;
    phone?: string;
    email?: string;
    userRole?: string;
    createTime?: string;
  };
}
