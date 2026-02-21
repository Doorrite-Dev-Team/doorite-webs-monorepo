interface Props {
  onClick: () => void
}

export default function OrderPin({ onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="absolute top-[55%] left-[60%] cursor-pointer"
    >
      <div className="bg-white rounded-xl shadow-lg p-3 flex gap-3">
        <span className="font-bold text-green-600">₦900</span>
        <span className="text-sm text-gray-500">Chicken Republic</span>
      </div>
    </div>
  )
}
