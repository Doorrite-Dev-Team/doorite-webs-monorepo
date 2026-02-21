import { RiderMapState } from "@/types/map";
import SearchingState from "./SearchingState";
import IncomingOrderState from "./IncomingOrderState";
import ActiveOrderState from "./ActiveOrderState";

type Props = {
  state: RiderMapState;
  onChangeState: (state: RiderMapState) => void;
};

export default function MapContainer({ state, onChangeState }: Props) {
  return (
    <div className="relative h-[-webkit-fill-available] w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Map Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfHBw1j70em6JPkXXJBMbqMsKJ8p3DJ7zhohUXWDIpDTjyV5oKOsrmK3xUqH2NPs0zZI3AbT54j_IAVStXNbpsU5ese3bziGcMd_2NCbOo2YwDHciktjHiVUmk6iP-jeuxx5B7tLzXeqtA6VKxN7lf0VPN8O-bJr_kHbzF_tVuaiSikvHf0MHQUS-OghWRtnsqjUId0_XXXW3ZiE-tyzy3is4m_MgeoAGk74kycTxAICbFkCxefeIwH3hieaUIguJqLiAaiHXh8YY')",
        }}
      />

      {/* UI Overlay */}
      {state === RiderMapState.SEARCHING && (
        <SearchingState onGoOnline={() => onChangeState(RiderMapState.INCOMING_ORDER)} />
      )}

      {state === RiderMapState.INCOMING_ORDER && (
        <IncomingOrderState
          onAccept={() => onChangeState(RiderMapState.ACTIVE_ORDER)}
          onDecline={() => onChangeState(RiderMapState.SEARCHING)}
        />
      )}

      {state === RiderMapState.ACTIVE_ORDER && (
        <ActiveOrderState />
      )}
    </div>
  );
}
