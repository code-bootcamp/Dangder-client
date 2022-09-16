import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { loggedInUserLoadable } from "../../../../Commons/Store/Auth/AccessToken";
import {
  IProfileInputState,
  profileInputState,
} from "../../../../Commons/Store/Profile/ProfileInitState";
import {
  IMutation,
  IMutationCreateDogArgs,
  IMutationGetDogInfoArgs,
  IMutationUploadFileArgs,
  IQuery,
  IUser,
} from "../../../../Commons/Types/Generated/types";
import ErrorModal from "../../../Commons/Modal/ErrorModal/ErrorModal";
import InitProfileUI from "./InitProfile.presenter";
import {
  CREATE_DOG,
  FETCH_CHARACTERS,
  FETCH_INTERESTS,
  GET_DOG_INFO,
  UPLOAD_FILE,
} from "./InitProfile.queries";

export default function InitProfileContainer() {
  const [regNumErrorVisible, setRegNumErrorVisible] = useState(false);

  const { contents: user } = useRecoilValueLoadable(loggedInUserLoadable);

  const geo = useGeolocation();

  const { data: charactersData } =
    useQuery<Pick<IQuery, "fetchCharacters">>(FETCH_CHARACTERS);

  const { data: interestsData } =
    useQuery<Pick<IQuery, "fetchInterests">>(FETCH_INTERESTS);

  const [getDogInfo] = useMutation<
    Pick<IMutation, "getDogInfo">,
    IMutationGetDogInfoArgs
  >(GET_DOG_INFO);

  const [createDog] = useMutation<
    Pick<IMutation, "createDog">,
    IMutationCreateDogArgs
  >(CREATE_DOG);

  const [uploadFiles] = useMutation<
    Pick<IMutation, "uploadFile">,
    IMutationUploadFileArgs
  >(UPLOAD_FILE);


  const handleCheckDogRegisterNumber = async (inputs: any) => {
    console.log("handleCheckDogRegisterNumber", inputs);

    if (
      !inputs.registerNumber ||
      !inputs.ownerBirthYear ||
      !inputs.ownerBirthMonth ||
      !inputs.ownerBirthDay
    ) {
      return false;
    }

    const birth =
      String(inputs.ownerBirthYear).substring(2) +
      String(inputs.ownerBirthMonth).padStart(2, "0") +
      String(inputs.ownerBirthDay).padStart(2, "0");

    try {
      const { data } = await getDogInfo({
        variables: {
          dogRegNum: inputs.registerNumber,
          ownerBirth: birth,
        },
      });

      console.log("getDogInfo", data);
      return true;
    } catch (e) {
      console.log("handleCheckDogRegister", e);
      setRegNumErrorVisible(true);
      return false;
    }
  };

  const handleCreateDog =
    (location: { lat: number; lng: number } | undefined, user: IUser) =>
    async (inputs: IProfileInputState) => {
      console.log("handleCheckDogRegisterNumber", user);

      const ownerBirth =
        String(inputs.ownerBirthYear).substring(2) +
        String(inputs.ownerBirthMonth).padStart(2, "0") +
        String(inputs.ownerBirthDay).padStart(2, "0");

      const dogBirth =
        String(inputs.createDogInput.dogBirthYear) +
        String(inputs.createDogInput.dogBirthMonth).padStart(2, "0") +
        String(inputs.createDogInput.dogBirthDay).padStart(2, "0");

      const age = moment().diff(moment(dogBirth), "years");

      try {
        const { data: filesData } = await uploadFiles({
          variables: { files: inputs.createDogInput.imageFiles },
        });

        if (!filesData) {
          // todo : 이미지 등록 실패 다이얼로그 띄우기
          return false;
        }

        const { data: result } = await createDog({
          variables: {
            createDogInput: {
              age: Number(age) || 1,
              description: inputs.createDogInput.introduce,
              birthday: dogBirth,
              interests: inputs.createDogInput.interests,
              characters: inputs.createDogInput.characters,
              avoidBreeds: ["asdfsdf", "불독"],
              locations: {
                lat: location?.lat || 0,
                lng: location?.lng || 0,
              },
              img: filesData.uploadFile,
              userId: user?.id || "",
            },
            dogRegNum: inputs.registerNumber,
            ownerBirth,
          },
        });
        console.log("handleCreateDog", result);
        return !!result?.createDog;
      } catch (e) {
        console.log("handleClickCreateDog", e);
        return false;
      }
    };

  return (
    <>
      <ErrorModal
        title="등록된 댕댕이의 정보를 <br/> 찾을 수 없습니다."
        subTitle="입력한 정보와 등록한 정보가 일치한지 <br/> 다시 확인해주세요."
        visible={regNumErrorVisible}
        setVisible={setRegNumErrorVisible}
      />

      {geo.latitude && user && (
        <InitProfileUI
          selectedData={{
            characters: charactersData,
            interests: interestsData,
          }}
          handleCheckDogRegisterNumber={handleCheckDogRegisterNumber}
          handleCreateDog={handleCreateDog(
            {
              lat: geo.latitude,
              lng: geo.longitude,
            },
            user
          )}
        />
      )}
    </>
  );
}
