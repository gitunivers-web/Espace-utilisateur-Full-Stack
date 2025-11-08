import VirtualCard from '../VirtualCard';

export default function VirtualCardExample() {
  return (
    <div className="p-8 bg-background flex items-center justify-center">
      <div className="w-[400px]">
        <VirtualCard
          cardHolder="SOPHIE MARTIN"
          cardNumber="**** **** **** 4829"
          expiryDate="12/26"
        />
      </div>
    </div>
  );
}
