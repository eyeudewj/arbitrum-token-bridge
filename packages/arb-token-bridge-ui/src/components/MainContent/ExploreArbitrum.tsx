import { Fragment, useMemo, useState } from 'react'
import { useWindowSize } from 'react-use'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { Tab } from '@headlessui/react'

import { Button } from '../common/Button'
import { TabButton } from '../common/Tab'
import { ExternalLink } from '../common/ExternalLink'
import { preloadImages } from '../../util'

import ExploreArbitrumContent from './ExploreArbitrumContent.json'

preloadImages([
  ...ExploreArbitrumContent.defi.map(p => p.imageSrc),
  ...ExploreArbitrumContent.nfts.map(p => p.imageSrc)
])

function getRandomInt({
  from,
  to,
  except
}: {
  from: number
  to: number
  except?: number
}): number {
  from = Math.ceil(from)
  to = Math.floor(to)

  const randomInt = Math.floor(Math.random() * (to - from + 1)) + from

  if (typeof except !== 'undefined' && randomInt === except) {
    return getRandomInt({ from, to, except })
  }

  return randomInt
}

function ProjectCard({
  name,
  description,
  href,
  imageSrc
}: {
  name: string
  description: string
  href: string
  imageSrc: string
}) {
  return (
    <ExternalLink
      href={href}
      className="arb-hover animate__animated animate__flipInX flex h-72 flex-col justify-between rounded-xl bg-gray-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${imageSrc}` }}
    >
      <div className="flex flex-grow items-center justify-between">
        <span className="text-explore-arbitrum-project-name pl-8 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          {name}
        </span>

        <div className="self-start p-4">
          <ExternalLinkIcon className="h-6 w-6 text-blue-arbitrum" />
        </div>
      </div>
      <div className="flex flex-row justify-between space-x-2 rounded-bl-xl rounded-br-xl bg-[rgba(0,0,0,0.29)] p-4 backdrop-blur-sm backdrop-filter">
        <p className="self-center font-light text-white">{description}</p>
        <img
          src="/images/Arbitrum_Symbol_-_Full_color_-_White_background.svg"
          alt="Arbitrum"
          className="h-8 self-end"
        />
      </div>
    </ExternalLink>
  )
}

const playImageNumber = getRandomInt({ from: 1, to: 4 })
const playImageHeights: {
  [playImageNumber: number]: number
} = {
  1: 820,
  2: 905,
  3: 695,
  4: 695
}

const defiMaxIndex = ExploreArbitrumContent.defi.length - 1
const nftMaxIndex = ExploreArbitrumContent.nfts.length - 1

export function ExploreArbitrum() {
  const { width } = useWindowSize()

  const [defiProjectIndex, setDefiProjectIndex] = useState(
    getRandomInt({ from: 0, to: defiMaxIndex })
  )
  const [nftProjectIndex, setNFTProjectIndex] = useState(
    getRandomInt({ from: 0, to: nftMaxIndex })
  )

  const iframeDimensions = useMemo(() => {
    const height = playImageHeights[playImageNumber]

    if (width < 640) {
      const scale = 218 / 640
      return { width: 218, height: height * scale }
    }

    // sm:
    if (width < 1024) {
      const scale = 400 / 640
      return { width: 400, height: height * scale }
    }

    // lg:
    return { width: 640, height }
  }, [width])

  function randomize() {
    setDefiProjectIndex(
      getRandomInt({ from: 0, to: defiMaxIndex, except: defiProjectIndex })
    )
    setNFTProjectIndex(
      getRandomInt({ from: 0, to: nftMaxIndex, except: nftProjectIndex })
    )
  }

  const defiProject = ExploreArbitrumContent.defi[defiProjectIndex]
  const nftProject = ExploreArbitrumContent.nfts[nftProjectIndex]

  return (
    <div className="w-full bg-white lg:rounded-xl">
      <div className="bg-blue-arbitrum p-6 lg:rounded-tl-xl lg:rounded-tr-xl">
        <p className="text-2xl text-white">For your enjoyment</p>
      </div>

      <Tab.Group>
        <Tab.List className="bg-blue-arbitrum">
          <Tab as={Fragment}>
            {({ selected }) => (
              <TabButton selected={selected}>Explore</TabButton>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => <TabButton selected={selected}>Play</TabButton>}
          </Tab>
        </Tab.List>

        <Tab.Panel className="flex flex-col space-y-4 px-8 py-4">
          <div className="grid grid-cols-1 gap-8 pt-6 sm:grid-cols-2">
            <div className="flex flex-col space-y-4">
              <p className="text-xl font-light text-dark">
                Invest your crypto in DeFi
              </p>
              <ProjectCard key={defiProject.name} {...defiProject} />
            </div>
            <div className="flex flex-col space-y-4">
              <p className="text-xl font-light text-dark">Get some dope NFTs</p>
              <ProjectCard key={nftProject.name} {...nftProject} />
            </div>
          </div>

          <div className="flex w-full justify-center py-6">
            <Button
              variant="primary"
              onClick={randomize}
              className="bg-blue-arbitrum px-8 text-2xl"
            >
              Randomize ✨
            </Button>
          </div>
        </Tab.Panel>
        <Tab.Panel className="flex flex-col space-y-4 px-8 py-4">
          <div className="h-3" />
          <p className="text-xl font-light text-dark">
            Allow your racing mind to settle by dragging your mouse around
          </p>
          <div className="flex w-full justify-center">
            <iframe
              title="Arbitrum Play"
              src={`https://dapper-centaur-5629df.netlify.app/?image=${playImageNumber}&width=${iframeDimensions.width}`}
              width={`${iframeDimensions.width}px`}
              height={`${iframeDimensions.height}px`}
              className="rounded-xl"
            />
          </div>
        </Tab.Panel>
      </Tab.Group>
    </div>
  )
}
