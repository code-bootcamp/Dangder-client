import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import LogoHeader from "./logo_header";
import Navigation from "./navigation";
import PageHeader from "./page_header";

const SHOW_LOGO_HEADERS = ["/", "/[dogId]"];

// TODO: 채팅방 - 약속 설정에 페이지 타이틀 헤더 추가
const SHOW_PAGE_HEADERS = [
  "/auth/password-reset",
  "/auth/signup",
  "/today",
  "/chat/[roomId]",
  "/chat",
  "/profile",
  "/profile/edit",
  "/profile/init",
  "/settings",
];

const SHOW_NAVIGATION = ["/", "/[dogId]", "/today", "/chat", "/profile"];

interface ILayoutProps {
  children: ReactNode;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: bisque;
`;

const HeaderWrapper = styled.div`
  background-color: aliceblue;
`;

const ContentsWrapper = styled.div`
  flex-grow: 1;
  background-color: aquamarine;
`;

const TabWrapper = styled.div`
  background-color: antiquewhite;
`;

// TODO: 불필요한 리렌더링 막기
export default function Layout(props: ILayoutProps) {
  const router = useRouter();
  console.log(router);
  const isShowLogoHeader = SHOW_LOGO_HEADERS.includes(router.pathname);
  const isShowPageHeader = SHOW_PAGE_HEADERS.includes(router.pathname);
  const isShowNavigation = SHOW_NAVIGATION.includes(router.pathname);

  return (
    <Wrapper>
      <HeaderWrapper>
        {isShowLogoHeader && <LogoHeader />}
        {isShowPageHeader && <PageHeader />}
      </HeaderWrapper>
      <ContentsWrapper>{props.children}</ContentsWrapper>
      <TabWrapper>{isShowNavigation && <Navigation />}</TabWrapper>
    </Wrapper>
  );
}
