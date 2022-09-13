import styled from "@emotion/styled";
import { memo, useEffect, useRef, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import {
  placeMessageState,
  PlaceMessageStateProps,
} from "../../../Commons/Store/Chat/Chat";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

declare const window: typeof globalThis & {
  kakao: any;
};

interface IMapProps {
  position?: { lat: number; lng: number };
  address?: string;
  onChangeMarker?: (obj: PlaceMessageStateProps) => void;
}

function Map({ position, address, onChangeMarker }: IMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=d860e7570db760ac5d5ed92bbabf6e21&autoload=false&libraries=services";
    document.head.appendChild(script);
    script.onload = () => {
      window.kakao.maps.load(() => {
        const coords = new window.kakao.maps.LatLng(33.450701, 126.570667);

        const marker = new window.kakao.maps.Marker({
          position: coords,
        });

        const options = {
          center: coords,
          level: 3,
        };

        if (!mapContainerRef.current) return;
        const map = new window.kakao.maps.Map(mapContainerRef.current, options);

        setMap(map);
        marker.setMap(map);

        window.kakao.maps.event.addListener(map, "click", (mouseEvent: any) => {
          console.log("map Click", mouseEvent.latLng);
          const latlng = mouseEvent.latLng;
          marker.setPosition(latlng);

          if (!onChangeMarker) return;

          onChangeMarker({
            lat: Number(latlng.getLat()),
            lng: Number(latlng.getLng()),
          });
        });
      });
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    if (position?.lat && position?.lng) {
      const coord = new window.kakao.maps.LatLng(position.lat, position.lng);
      const marker = new window.kakao.maps.Marker({
        position: coord,
      });

      marker.setMap(map);
      map.setCenter(coord);
    }
  }, [position, map, address]);

  return (
    <>
      <Wrapper ref={mapContainerRef}> </Wrapper>
    </>
  );
}

export default memo(Map);
