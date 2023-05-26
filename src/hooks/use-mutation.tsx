import { useState } from "react";
import { useMutation } from "react-query";

// type aliases
type HTTPRequestType = (arg: any) => Promise<any>;

function useMyMutation<T extends HTTPRequestType>(
  httpRequest: T,
  mutateFunction?: Function | null,
  successFunction?: Function | null
) {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const useMutationVar = useMutation<
    Object,
    any,
    Object,
    { ctxFunc: Function }
  >(async (requestData) => await httpRequest(requestData), {
    onMutate: (requestData) => mutateFunction && mutateFunction(requestData),
    onSuccess: (responseData) =>
      successFunction && successFunction(responseData),
    onError: async (err: any, _, context) => {
      const status: number | undefined = err.response?.status || err.status;

      switch (status) {
        case 400:
          setErrorMessage("Erreur dans un/plusieurs champs.");
          break;
        case 401:
          setErrorMessage("Accès non autorisé.");
          break;
        case 409:
          setErrorMessage("Utilisateur déjà enregistré.");
          break;
        default:
          setErrorMessage("Une erreur est survenue.");
      }

      if (context && context.ctxFunc) context.ctxFunc();
    },
  });

  return {
    useMutation: useMutationVar,
    errorMessage,
  };
}

export default useMyMutation;
