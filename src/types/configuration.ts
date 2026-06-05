export type ConfigData = {
  message: string;
  data: {
    aws: {
      bucketName: string;
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
      isLocal?: boolean;
    };
    brevo: {
      senderName: string;
      senderEmail: string;
      mailApiKey: string;
      isLocal?: boolean;
    };
    oneSignal: {
      oneSignalAppId: string;
      oneSignalApiKey: string;
      isLocal?: boolean;
    };
    _id: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type SendMailFormType = {
  email: string;
  subject: string;
  content: string;
};
