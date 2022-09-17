import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  IMutation,
  IMutationDeleteUserArgs,
  // IMutationDeleteUserArgs,
} from "../../../Commons/Types/Generated/types";
import DeleteUserModal from "./DeleteUserModal/DeleteUserModal";
import SettingsUI from "./Settings.presenter";
import { DELETE_USER, USER_LOG_OUT } from "./Settings.queries";

export default function Settings() {
  const router = useRouter();
  const [deleteUserCheckModal, setDeleteUserCheckModal] = useState(false);

  const [userLogout] = useMutation<Pick<IMutation, "userLogout">>(USER_LOG_OUT);
  const [deleteUser] = useMutation<
    Pick<IMutation, "deleteUser">,
    IMutationDeleteUserArgs
  >(DELETE_USER);

  const handleUserLogout = async () => {
    try {
      await userLogout();
      router.push("/auth/login");
    } catch (e) {
      console.log("handleUserLogoutError", e);
    }
  };

  const handleClickModal = () => {
    setDeleteUserCheckModal(true);
  };

  const handleClickPasswordReset = () => {
    router.push("/auth/password-reset");
  };

  return (
    <>
      <DeleteUserModal
        title="계정을 삭제하시겠습니까?"
        subTitle="계정 삭제 후, 계정 정보가 삭제되며,<br/> 모든 데이터는 복구가 불가능 합니다."
        visible={deleteUserCheckModal}
        setVisible={setDeleteUserCheckModal}
      />
      <SettingsUI
        handleUserLogout={handleUserLogout}
        handleClickModal={handleClickModal}
        handleClickPasswordReset={handleClickPasswordReset}
        // handleDeleteUser={handleDeleteUser}
      />
    </>
  );
}
